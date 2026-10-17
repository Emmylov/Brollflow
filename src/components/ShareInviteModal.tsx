import React, { useState } from 'react';
import {
  Check,
  Copy,
  Globe,
  Mail,
  Shield,
  Trash2,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { ThemeMode } from '../types';

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Reviewer';
  avatarBg: string;
  isOwner?: boolean;
  online?: boolean;
}

interface ShareInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  projectId?: string;
  projectName?: string;
  collaborators: Collaborator[];
  onAddCollaborator: (email: string, role: 'Admin' | 'Editor' | 'Reviewer') => void;
  onRemoveCollaborator: (id: string) => void;
  onUpdateRole: (id: string, role: 'Admin' | 'Editor' | 'Reviewer') => void;
}

export const ShareInviteModal: React.FC<ShareInviteModalProps> = ({
  isOpen,
  onClose,
  theme,
  projectId = 'active-session',
  projectName = 'Active Project',
  collaborators,
  onAddCollaborator,
  onRemoveCollaborator,
  onUpdateRole,
}) => {
  const isDark = theme === 'dark';
  const [emailInput, setEmailInput] = useState('');
  const [selectedRole, setSelectedRole] = useState<'Admin' | 'Editor' | 'Reviewer'>('Editor');
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const shareableUrl = `https://brollflow.vercel.app/studio?project=${projectId}&access=collab`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    onAddCollaborator(emailInput.trim(), selectedRole);
    setToastMessage(`Invitation sent to ${emailInput.trim()} (${selectedRole})`);
    setEmailInput('');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-2xl bg-black/80 animate-fade-in">
      <div
        className={`w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col transition-all ${
          isDark
            ? 'bg-[#0D0D0E]/95 border-zinc-800 text-zinc-100 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]'
            : 'bg-white/95 border-zinc-200 text-zinc-900 shadow-2xl'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${
            isDark ? 'border-zinc-800/80 bg-[#121214]' : 'border-zinc-200 bg-zinc-50'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C9A063]/15 border border-[#C9A063]/30 flex items-center justify-center text-[#C9A063]">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">Share &amp; Invite Collaborators</h3>
              <p className="text-[11px] font-mono-tabular text-zinc-400">
                Project: <span className="text-[#C9A063] font-semibold">{projectName}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-lg border transition-colors ${
              isDark
                ? 'border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
                : 'border-zinc-200 text-zinc-600 hover:text-black hover:bg-zinc-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Toast */}
        {toastMessage && (
          <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-6 py-2.5 flex items-center gap-2 text-xs font-medium text-emerald-400 animate-fade-in">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          {/* 1. Email Invite Input Section */}
          <section className="space-y-2.5">
            <label className="block text-xs font-bold text-zinc-300">
              Invite by Email
            </label>
            <form onSubmit={handleSendInvite} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500 pointer-events-none" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="collaborator@company.com"
                  className={`w-full pl-9 pr-3 py-2 rounded-lg border text-xs outline-none transition-colors ${
                    isDark
                      ? 'bg-[#151518] border-zinc-700/80 text-zinc-100 focus:border-[#C9A063]'
                      : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-black'
                  }`}
                />
              </div>

              <select
                value={selectedRole}
                onChange={(e) =>
                  setSelectedRole(e.target.value as 'Admin' | 'Editor' | 'Reviewer')
                }
                className={`px-3 py-2 rounded-lg border text-xs font-semibold outline-none cursor-pointer ${
                  isDark
                    ? 'bg-[#151518] border-zinc-700/80 text-zinc-200'
                    : 'bg-zinc-50 border-zinc-300 text-zinc-800'
                }`}
              >
                <option value="Editor">Editor</option>
                <option value="Reviewer">Reviewer</option>
                <option value="Admin">Admin</option>
              </select>

              <button
                type="submit"
                disabled={!emailInput.trim()}
                className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs shadow-md transition-all whitespace-nowrap ${
                  emailInput.trim()
                    ? isDark
                      ? 'bg-[#C9A063] text-[#050505] hover:bg-[#d8b47b] active:scale-95'
                      : 'bg-black text-white hover:bg-zinc-800 active:scale-95'
                    : 'opacity-40 cursor-not-allowed bg-zinc-800 text-zinc-500'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Invite</span>
              </button>
            </form>
          </section>

          {/* 2. Copy Project Link Section */}
          <section
            className={`p-4 rounded-xl border space-y-2.5 ${
              isDark ? 'bg-[#141416] border-zinc-800/80' : 'bg-zinc-50 border-zinc-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <Globe className="w-3.5 h-3.5 text-[#C9A063]" />
                <span>Shareable Session Link</span>
              </div>
              <span className="text-[10px] font-mono-tabular text-zinc-500">Live Sync</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareableUrl}
                className={`flex-1 px-3 py-2 rounded-lg border text-[11px] font-mono-tabular truncate outline-none select-all ${
                  isDark
                    ? 'bg-[#0A0A0B] border-zinc-800 text-zinc-400'
                    : 'bg-white border-zinc-300 text-zinc-600'
                }`}
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold text-xs shadow transition-all shrink-0 ${
                  copiedLink
                    ? 'bg-emerald-600 text-white'
                    : isDark
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                    : 'bg-zinc-200 hover:bg-zinc-300 text-zinc-900'
                }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[10px] text-zinc-400">
              Anyone with this link and an authorized account can view or collaborate based on their role.
            </p>
          </section>

          {/* 3. Active Project Collaborators List */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-300">
                Active Project Collaborators ({collaborators.length})
              </label>
              <span className="text-[10px] font-mono-tabular text-[#C9A063]">
                Role-Based Permissions
              </span>
            </div>

            <div
              className={`divide-y rounded-xl border overflow-hidden ${
                isDark ? 'bg-[#121214] border-zinc-800/80 divide-zinc-800/60' : 'bg-white border-zinc-200 divide-zinc-100'
              }`}
            >
              {collaborators.map((member) => (
                <div
                  key={member.id}
                  className="px-3.5 py-3 flex items-center justify-between gap-3 hover:bg-zinc-500/5 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 relative"
                      style={{ backgroundColor: member.avatarBg }}
                    >
                      {member.name.charAt(0).toUpperCase()}
                      {member.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#121214]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs truncate">
                          {member.name}
                        </span>
                        {member.isOwner && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono-tabular font-bold bg-[#C9A063]/20 text-[#C9A063] border border-[#C9A063]/40">
                            Owner
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-zinc-400 font-mono-tabular truncate block">
                        {member.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {member.isOwner ? (
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-mono-tabular font-semibold bg-zinc-800 text-zinc-400">
                        Owner / Admin
                      </span>
                    ) : (
                      <>
                        <select
                          value={member.role}
                          onChange={(e) =>
                            onUpdateRole(
                              member.id,
                              e.target.value as 'Admin' | 'Editor' | 'Reviewer'
                            )
                          }
                          className={`px-2 py-1 rounded-md border text-[11px] font-medium outline-none cursor-pointer ${
                            isDark
                              ? 'bg-[#18181B] border-zinc-700 text-zinc-200'
                              : 'bg-zinc-50 border-zinc-300 text-zinc-800'
                          }`}
                        >
                          <option value="Editor">Editor</option>
                          <option value="Reviewer">Reviewer</option>
                          <option value="Admin">Admin</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => onRemoveCollaborator(member.id)}
                          className="p-1.5 rounded-md text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Revoke access"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Modal Footer */}
        <div
          className={`px-6 py-3.5 border-t flex items-center justify-between ${
            isDark ? 'border-zinc-800/80 bg-[#121214]' : 'border-zinc-200 bg-zinc-50'
          }`}
        >
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono-tabular">
            <Shield className="w-3.5 h-3.5 text-[#C9A063]" />
            <span>End-to-end multi-user timeline lock active</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
              isDark
                ? 'border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white'
                : 'border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-100'
            }`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
