import React, { useEffect, useState } from 'react';
import {
  Clock,
  Copy,
  Download,
  Film,
  FolderOpen,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  X,
  Zap,
} from 'lucide-react';
import { deleteProject, getProjects, saveProject } from '../services/firebase';
import { SavedProject, SubtitleStyleConfig, ThemeMode, UserProfile } from '../types';

interface ProjectVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  theme: ThemeMode;
  currentProject: {
    id?: string;
    name: string;
    aspectRatio: '9:16' | '16:9' | '1:1';
    scriptText: string;
    brollItems: any[];
    captionItems: any[];
    sfxItems: any[];
    subtitleStyle: SubtitleStyleConfig;
  };
  onLoadProject: (project: SavedProject) => void;
}

export const ProjectVaultModal: React.FC<ProjectVaultModalProps> = ({
  isOpen,
  onClose,
  user,
  theme,
  currentProject,
  onLoadProject,
}) => {
  const isDark = theme === 'dark';
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [projectNameInput, setProjectNameInput] = useState<string>(currentProject.name);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchProjects = async () => {
    if (!user?.uid) {
      // Local fallback
      return;
    }
    setIsLoading(true);
    try {
      const list = await getProjects(user.uid);
      setProjects(list);
    } catch (e) {
      console.warn('Failed to fetch projects from Firestore:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
      setProjectNameInput(currentProject.name);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSaveCurrentToVault = async () => {
    const newProjId = currentProject.id || `proj-${Date.now()}`;
    const projToSave: SavedProject = {
      id: newProjId,
      userId: user?.uid || 'guest',
      name: projectNameInput || 'Untitled Video Project',
      aspectRatio: currentProject.aspectRatio,
      scriptText: currentProject.scriptText,
      brollItems: currentProject.brollItems,
      captionItems: currentProject.captionItems,
      sfxItems: currentProject.sfxItems,
      subtitleStyle: currentProject.subtitleStyle,
      updatedAt: new Date().toISOString(),
      thumbnailUrl: currentProject.brollItems[0]?.imageUrl || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80',
    };

    if (user?.uid) {
      try {
        await saveProject(user.uid, projToSave);
        setFeedback('Project successfully saved to Firestore Vault!');
        fetchProjects();
      } catch (e) {
        setFeedback('Error saving project to cloud vault.');
      }
    } else {
      // Local state update
      setProjects((prev) => [projToSave, ...prev.filter((p) => p.id !== projToSave.id)]);
      setFeedback('Project saved locally (sign in to sync to Firestore).');
    }

    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDuplicate = async (proj: SavedProject) => {
    const cloned: SavedProject = {
      ...proj,
      id: `proj-${Date.now()}`,
      name: `${proj.name} (Copy)`,
      updatedAt: new Date().toISOString(),
    };
    if (user?.uid) {
      await saveProject(user.uid, cloned);
      fetchProjects();
    } else {
      setProjects((prev) => [cloned, ...prev]);
    }
  };

  const handleDelete = async (projId: string) => {
    if (user?.uid) {
      try {
        await deleteProject(user.uid, projId);
        fetchProjects();
      } catch (e) {
        console.warn('Delete error:', e);
      }
    } else {
      setProjects((prev) => prev.filter((p) => p.id !== projId));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-2xl transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Slide-out drawer from left */}
      <div
        className={`relative w-full max-w-xl h-full flex flex-col z-10 shadow-2xl border-r ${
          isDark
            ? 'bg-zinc-950 border-zinc-800 text-white'
            : 'bg-white border-zinc-200 text-zinc-900'
        } animate-slide-right`}
      >
        {/* Header */}
        <div className={`p-6 border-b flex items-center justify-between ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Project Vault</h2>
              <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                {user ? `Cloud Vault (${user.email})` : 'Local Guest Vault (Sign in for Cloud Sync)'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              isDark ? 'hover:bg-zinc-900 text-zinc-400 hover:text-white' : 'hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Save Current Session Bar */}
        <div className={`p-6 border-b ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
          <label className={`block text-xs font-medium mb-2 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
            Save Current Workspace State
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={projectNameInput}
              onChange={(e) => setProjectNameInput(e.target.value)}
              placeholder="Enter project title..."
              className={`flex-1 px-4 py-2.5 text-sm rounded-xl border transition-all outline-none ${
                isDark
                  ? 'bg-zinc-900 border-zinc-700 text-white focus:border-amber-500'
                  : 'bg-white border-zinc-300 text-zinc-900 focus:border-amber-500'
              }`}
            />
            <button
              type="button"
              onClick={handleSaveCurrentToVault}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-sm transition-all shadow-lg shadow-amber-500/20 shrink-0"
            >
              <Save className="w-4 h-4" />
              Save to Vault
            </button>
          </div>
          {feedback && (
            <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium animate-fade-in flex items-center gap-2">
              <Zap className="w-4 h-4 shrink-0" />
              {feedback}
            </div>
          )}
        </div>

        {/* Project List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Saved Projects ({projects.length})
            </h3>
            <button
              type="button"
              onClick={fetchProjects}
              className={`flex items-center gap-1.5 text-xs font-medium ${isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-800/50 flex items-center justify-center mx-auto text-zinc-500">
                <Film className="w-6 h-6" />
              </div>
              <p className={`text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                No saved projects in your vault yet
              </p>
              <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                Save your current timeline configuration above to get started.
              </p>
            </div>
          ) : (
            projects.map((proj) => (
              <div
                key={proj.id}
                className={`p-4 rounded-2xl border transition-all group flex gap-4 items-center ${
                  isDark
                    ? 'bg-zinc-900/60 border-zinc-800 hover:border-amber-500/50'
                    : 'bg-white border-zinc-200 hover:border-amber-500/50 shadow-sm'
                }`}
              >
                {/* Thumbnail */}
                <div className="relative w-24 h-16 rounded-xl overflow-hidden shrink-0 bg-zinc-800">
                  <img
                    src={proj.thumbnailUrl || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80'}
                    alt={proj.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-amber-400 font-bold">
                    {proj.aspectRatio}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    {proj.name}
                  </h4>
                  <div className={`flex items-center gap-3 mt-1 text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(proj.updatedAt).toLocaleDateString()} {new Date(proj.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span>•</span>
                    <span className="font-mono">{proj.brollItems.length} clips</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onLoadProject(proj);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20"
                    title="Load project into active timeline"
                  >
                    Load
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDuplicate(proj)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white' : 'hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900'
                    }`}
                    title="Duplicate project"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(proj.id)}
                    className={`p-2 rounded-lg transition-colors text-rose-400 hover:bg-rose-500/10`}
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
