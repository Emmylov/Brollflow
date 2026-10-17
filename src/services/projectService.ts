// src/services/projectService.ts
// Client-side project persistence and project management using localStorage.

export type TrackType = 'audio' | 'video' | 'overlay' | 'sfx' | 'subtitles';

export interface TimelineItem {
  id: string;
  type: TrackType;
  start: number; // seconds
  end: number; // seconds
  meta?: Record<string, any>;
}

export interface TimelineTrack {
  id: string;
  name: string;
  type: TrackType;
  items: TimelineItem[];
  lockedBy?: string | null;
}

export interface ScriptSegment {
  id: string;
  text: string;
  start: number; // seconds
  end: number; // seconds
}

export interface ApiVaultKeys {
  openai?: string | null;
  pexels?: string | null;
  freesound?: string | null;
}

export interface Project {
  id: string;
  title: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  durationSeconds: number;
  scriptText: string;
  scriptSegments: ScriptSegment[];
  timeline: TimelineTrack[]; // Track 1..4
  apiKeys: ApiVaultKeys;
}

const PROJECTS_KEY = 'brollflow:projects:v1';
const ACTIVE_PROJECT_KEY = 'brollflow:activeProject:v1';

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function nowISO() {
  return new Date().toISOString();
}

function loadAllProjects(): Record<string, Project> {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, Project>;
  } catch (e) {
    console.warn('Failed to parse projects from localStorage', e);
    return {};
  }
}

function persistAllProjects(map: Record<string, Project>) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(map));
}

export class ProjectService {
  private listeners: Set<(projects: Project[], activeId: string | null) => void> = new Set();
  private debounceTimer: number | null = null;

  listProjects(): Project[] {
    const map = loadAllProjects();
    return Object.values(map).sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  }

  getActiveProjectId(): string | null {
    return localStorage.getItem(ACTIVE_PROJECT_KEY);
  }

  setActiveProjectId(id: string | null) {
    if (id === null) localStorage.removeItem(ACTIVE_PROJECT_KEY);
    else localStorage.setItem(ACTIVE_PROJECT_KEY, id);
    this.emit();
  }

  getProject(id: string): Project | null {
    const map = loadAllProjects();
    return map[id] ?? null;
  }

  createProject(opts?: { title?: string }): Project {
    const id = uuidv4();
    const now = nowISO();
    const project: Project = {
      id,
      title: opts?.title ?? 'Untitled Project',
      createdAt: now,
      updatedAt: now,
      durationSeconds: 0,
      scriptText: '',
      scriptSegments: [],
      timeline: [
        { id: uuidv4(), name: 'Audio Baseline', type: 'audio', items: [] },
        { id: uuidv4(), name: 'Video Clips', type: 'video', items: [] },
        { id: uuidv4(), name: 'Overlays & Subtitles', type: 'overlay', items: [] },
        { id: uuidv4(), name: 'SFX', type: 'sfx', items: [] },
      ],
      apiKeys: {},
    };
    const map = loadAllProjects();
    map[id] = project;
    persistAllProjects(map);
    this.setActiveProjectId(id);
    this.emit();
    return project;
  }

  saveProject(project: Project) {
    const map = loadAllProjects();
    project.updatedAt = nowISO();
    map[project.id] = project;
    persistAllProjects(map);
    this.scheduleEmit();
  }

  deleteProject(id: string) {
    const map = loadAllProjects();
    if (map[id]) delete map[id];
    persistAllProjects(map);
    const active = this.getActiveProjectId();
    if (active === id) this.setActiveProjectId(null);
    this.emit();
  }

  // Simple auto-save helper: updates project then persists after a short debounce
  autoSaveUpdate(projectId: string, patch: Partial<Project>) {
    const map = loadAllProjects();
    const existing = map[projectId];
    if (!existing) return;
    const updated: Project = { ...existing, ...patch, updatedAt: nowISO() };
    map[projectId] = updated;
    persistAllProjects(map);
    this.scheduleEmit();
  }

  subscribe(fn: (projects: Project[], activeId: string | null) => void) {
    this.listeners.add(fn);
    // immediate call
    fn(this.listProjects(), this.getActiveProjectId());
    return () => this.listeners.delete(fn);
  }

  private scheduleEmit() {
    if (this.debounceTimer) window.clearTimeout(this.debounceTimer);
    this.debounceTimer = window.setTimeout(() => this.emit(), 250);
  }

  private emit() {
    const projects = this.listProjects();
    const active = this.getActiveProjectId();
    this.listeners.forEach((l) => l(projects, active));
  }
}

export const projectService = new ProjectService();

// Example usage:
// import { projectService } from './services/projectService';
// const p = projectService.createProject({ title: 'New Video' });
// projectService.subscribe((projects, active) => setState({ projects, active }));
