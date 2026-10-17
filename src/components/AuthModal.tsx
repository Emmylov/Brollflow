import React, { useState } from 'react';
import { X, Eye, EyeOff, ArrowRight, Lock, Mail, User } from 'lucide-react';
import { PricingTierName, ThemeMode, UserProfile } from '../types';
import {
  signInWithGoogle,
  signInWithApple,
  signInWithEmail,
  signUpWithEmail,
} from '../services/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
  selectedTier: PricingTierName;
  theme: ThemeMode;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  selectedTier,
  theme,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('elena.rostova@atelier-cinema.ch');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('Please enter a valid studio or personal email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const displayName =
        mode === 'signup' && name.trim()
          ? name.trim()
          : trimmedEmail.split('@')[0].replace(/[._]/g, ' ');

      let user;
      if (mode === 'signup') {
        user = await signUpWithEmail(trimmedEmail, password, displayName);
      } else {
        user = await signInWithEmail(trimmedEmail, password);
      }

      setIsSubmitting(false);
      onSuccess({
        uid: user.uid,
        name: user.displayName || displayName,
        email: user.email || trimmedEmail,
        authProvider: 'email',
        selectedTier,
      });
    } catch (err: any) {
      console.warn('Firebase email auth notice:', err);
      // If email/password is not enabled in Firebase project console, provide clear guidance & allow local studio bypass
      if (err?.code === 'auth/operation-not-allowed') {
        setError('Email/Password provider not yet enabled in Firebase Console. You can also sign in with Google or continue in Studio Demo mode.');
      } else if (err?.code === 'auth/invalid-credential' || err?.code === 'auth/wrong-password' || err?.code === 'auth/user-not-found') {
        setError('Invalid email or password credentials. Please verify your details.');
      } else if (err?.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Please switch to Sign In.');
      } else {
        // Fallback gracefully so the creator can work without interruption
        setError(err?.message || 'Authentication error. Please check your credentials or try Google sign in.');
      }
      setIsSubmitting(false);
    }
  };

  const handleSocialAuth = async (provider: 'apple' | 'google') => {
    setError(null);
    setIsSubmitting(true);
    try {
      if (provider === 'google') {
        const user = await signInWithGoogle();
        setIsSubmitting(false);
        onSuccess({
          uid: user.uid,
          name: user.displayName || 'Google Creator',
          email: user.email || 'creator@google.internal',
          authProvider: 'google',
          selectedTier,
        });
      } else {
        const user = await signInWithApple();
        setIsSubmitting(false);
        onSuccess({
          uid: user.uid,
          name: user.displayName || 'Apple Creator',
          email: user.email || 'creator@apple.internal',
          authProvider: 'apple',
          selectedTier,
        });
      }
    } catch (err: any) {
      console.warn('Social auth notice:', err);
      setError(err?.message || 'Social sign-in was cancelled or encountered an issue.');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div
        className={`relative w-full max-w-md rounded-xl border p-7 transition-colors duration-200 ${
          isDark
            ? 'bg-[#0C0C0C]/95 border-[#161616] text-[#F4F4F5]'
            : 'bg-white/95 border-[#E1E1E1] text-[#111111]'
        }`}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1.5">
              <span>B-Roll Flow Studio</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular">{selectedTier} Tier</span>
            </div>
            <h2
              id="auth-modal-title"
              className="font-serif-editorial text-3xl font-semibold tracking-tight"
            >
              {mode === 'signin' ? 'Sign In to Workspace' : 'Create Studio Account'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close authentication modal"
            className={`p-2 rounded-lg border transition-colors ${
              isDark
                ? 'border-[#161616] text-zinc-400 hover:text-white hover:bg-[#161616]'
                : 'border-[#E1E1E1] text-zinc-500 hover:text-black hover:bg-zinc-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Segmented Toggle */}
        <div
          className={`grid grid-cols-2 p-1 rounded-lg border mb-6 ${
            isDark ? 'bg-[#050505] border-[#161616]' : 'bg-[#F5F5F7] border-[#E1E1E1]'
          }`}
        >
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError(null);
            }}
            className={`py-2 px-4 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              mode === 'signin'
                ? isDark
                  ? 'bg-[#0C0C0C] text-[#C9A063] border border-[#161616]'
                  : 'bg-white text-[#111111] shadow-xs'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`py-2 px-4 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              mode === 'signup'
                ? isDark
                  ? 'bg-[#0C0C0C] text-[#C9A063] border border-[#161616]'
                  : 'bg-white text-[#111111] shadow-xs'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Social Buttons */}
        <div className="space-y-2.5 mb-6">
          <button
            type="button"
            onClick={() => handleSocialAuth('apple')}
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap ${
              isDark
                ? 'bg-[#050505] border-[#161616] text-zinc-200 hover:border-zinc-700 hover:bg-[#121212]'
                : 'bg-[#F5F5F7] border-[#E1E1E1] text-zinc-900 hover:bg-zinc-200/70'
            }`}
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            <span>Continue with Apple</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialAuth('google')}
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap ${
              isDark
                ? 'bg-[#050505] border-[#161616] text-zinc-200 hover:border-zinc-700 hover:bg-[#121212]'
                : 'bg-[#F5F5F7] border-[#E1E1E1] text-zinc-900 hover:bg-zinc-200/70'
            }`}
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Hairline Divider */}
        <div className="relative flex items-center justify-center mb-6">
          <div
            className={`w-full border-t ${
              isDark ? 'border-[#161616]' : 'border-[#E1E1E1]'
            }`}
          />
          <span
            className={`px-3 text-xs whitespace-nowrap ${
              isDark ? 'bg-[#0C0C0C] text-zinc-500' : 'bg-white text-zinc-500'
            }`}
          >
            or credentials
          </span>
        </div>

        {/* Email & Masked Password Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium mb-1.5 text-zinc-400">
                Full Name or Studio Alias
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Elena Rostova"
                  className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border outline-none transition-colors ${
                    isDark
                      ? 'bg-[#050505] border-[#161616] text-white focus:border-[#C9A063]'
                      : 'bg-[#F5F5F7] border-[#E1E1E1] text-black focus:border-black'
                  }`}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium mb-1.5 text-zinc-400">
              Work Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@studio.ch"
                className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border outline-none transition-colors ${
                  isDark
                    ? 'bg-[#050505] border-[#161616] text-white focus:border-[#C9A063]'
                    : 'bg-[#F5F5F7] border-[#E1E1E1] text-black focus:border-black'
                }`}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-zinc-400">Password</label>
              <span className="text-xs text-zinc-500 font-mono-tabular">AES-256 Vault</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-lg border outline-none transition-colors ${
                  isDark
                    ? 'bg-[#050505] border-[#161616] text-white focus:border-[#C9A063]'
                    : 'bg-[#F5F5F7] border-[#E1E1E1] text-black focus:border-black'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 pt-1" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              isDark
                ? 'bg-[#C9A063] text-[#050505] hover:bg-[#d4af76]'
                : 'bg-[#111111] text-white hover:bg-zinc-800'
            }`}
          >
            <span>
              {isSubmitting
                ? 'Initializing Workspace...'
                : mode === 'signin'
                ? 'Sign In & Configure Studio'
                : 'Create Account & Configure Studio'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
