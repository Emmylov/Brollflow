// src/services/presenceService.ts
// Abstraction layer for presence/collaboration. Bind this to a WebSocket/Supabase/Firebase provider
// in the app bootstrap. Designed to default to an empty state for fresh projects/accounts.

export type CollaboratorRole = 'Editor' | 'Reviewer' | 'Admin' | 'Viewer';

export interface Collaborator {
  id: string;
  name: string;
  avatarUrl?: string | null;
  role?: CollaboratorRole;
  color?: string; // UI accent color for cursor and pill
  cursor?: { x: number; y: number; timestamp: number } | null;
  lastActiveAt?: string | null; // ISO timestamp
}

export type PresenceListener = (collaborators: Collaborator[]) => void;

export type ProviderKind = 'none' | 'websocket' | 'supabase' | 'firebase' | 'custom';

export interface ProviderConfig {
  kind: ProviderKind;
  // free-form config suitable for your provider (url, keys, refs). Keep secrets out of frontend.
  config?: Record<string, any>;
}

// Minimal UUIDv4 generator (no external deps). Good enough for client IDs and mock collaborators.
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export class PresenceService {
  private provider: ProviderConfig = { kind: 'none' };
  private collaborators: Collaborator[] = []; // default empty state
  private listeners: Set<PresenceListener> = new Set();
  private simulateMode = false;

  // Set the provider. The app can call this at startup with env-based config.
  setProvider(provider: ProviderConfig) {
    this.provider = provider;
    // If provider.kind !== 'none' you would initialize and attach realtime subscriptions here.
    // This module intentionally does not implement a concrete connection; it's an adapter.
  }

  getProvider() {
    return this.provider;
  }

  // Subscribe to presence changes
  subscribe(listener: PresenceListener) {
    this.listeners.add(listener);
    // immediately notify with current state
    listener(this.collaborators.slice());
    return () => this.listeners.delete(listener);
  }

  private emit() {
    const snapshot = this.collaborators.slice();
    this.listeners.forEach((l) => l(snapshot));
  }

  // Use simulate mode to instantly populate mock collaborators for demos.
  // NOTE: these mocks are only created when simulate=true is explicitly set by the UI.
  setSimulateMode(on: boolean) {
    this.simulateMode = on;
    if (on) {
      // create 2-3 demo collaborators with vibrant colors matching design system
      this.collaborators = [
        {
          id: 'demo-sarah',
          name: 'Sarah (Lead Editor)',
          role: 'Editor',
          color: '#00FFFF',
          avatarUrl: null,
          cursor: { x: 120, y: 80, timestamp: Date.now() },
          lastActiveAt: new Date().toISOString(),
        },
        {
          id: 'demo-alex',
          name: 'Alex (Reviewer)',
          role: 'Reviewer',
          color: '#8B5CF6',
          avatarUrl: null,
          cursor: { x: 320, y: 160, timestamp: Date.now() },
          lastActiveAt: new Date().toISOString(),
        },
      ];
      this.emit();
    } else {
      // clear simulated collaborators, preserving an empty array for fresh accounts
      this.collaborators = [];
      this.emit();
    }
  }

  isSimulating() {
    return this.simulateMode;
  }

  // Add a collaborator (useful when receiving remote presence events)
  addCollaborator(partial: Omit<Collaborator, 'id'> & { id?: string }) {
    const id = partial.id ?? uuidv4();
    const coll: Collaborator = {
      id,
      name: partial.name,
      avatarUrl: partial.avatarUrl ?? null,
      role: partial.role ?? 'Viewer',
      color: partial.color ?? this.pickAccentColor(),
      cursor: partial.cursor ?? null,
      lastActiveAt: partial.lastActiveAt ?? new Date().toISOString(),
    };
    this.collaborators.push(coll);
    this.emit();
    return coll;
  }

  // Remove by id
  removeCollaborator(id: string) {
    const before = this.collaborators.length;
    this.collaborators = this.collaborators.filter((c) => c.id !== id);
    if (this.collaborators.length !== before) this.emit();
  }

  // Update cursor position for a collaborator id
  updateCursor(id: string, x: number, y: number) {
    const idx = this.collaborators.findIndex((c) => c.id === id);
    if (idx === -1) return;
    this.collaborators[idx] = {
      ...this.collaborators[idx],
      cursor: { x, y, timestamp: Date.now() },
      lastActiveAt: new Date().toISOString(),
    };
    this.emit();
  }

  // Returns a snapshot copy
  getCollaborators() {
    return this.collaborators.slice();
  }

  // Small helper to choose accent colors in rotation
  private accentPool = ['#00FFFF', '#8B5CF6', '#F43F5E', '#F59E0B'];
  private pickAccentColor() {
    return this.accentPool[Math.floor(Math.random() * this.accentPool.length)];
  }

  // Focus helper: returns collaborator cursor if present
  getCursorFor(collaboratorId: string) {
    const c = this.collaborators.find((x) => x.id === collaboratorId);
    return c?.cursor ?? null;
  }
}

// Export a singleton instance for easy app wiring
export const presenceService = new PresenceService();

// Example usage (app bootstrap):
// import { presenceService } from './services/presenceService';
// presenceService.setProvider({ kind: 'websocket', config: { url: process.env.PRESENCE_WS } });
// presenceService.subscribe((list) => setState({ collaborators: list }));
// Hook UI 'Simulate Collab' toggle to presenceService.setSimulateMode(true/false)
