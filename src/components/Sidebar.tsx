import React from 'react';
import { Plus, Trash2, Moon, Sun, BookmarkOpen, Info, X } from 'lucide-react';
import type { ChatSession } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  currentSessionId: string;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
  onDeleteSession: (sessionId: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onShowSavedAnswers: () => void;
  onShowInfo: () => void;
}

export default function Sidebar({
  isOpen,
  onClose,
  sessions,
  currentSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  isDarkMode,
  onToggleDarkMode,
  onShowSavedAnswers,
  onShowInfo
}: SidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative w-64 h-screen bg-[var(--surface)] border-r border-[var(--border)] flex flex-col transform transition-transform duration-300 z-40 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <h2 className="font-semibold text-lg">Conversations</h2>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-[var(--bg-secondary)] rounded-lg"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* New Session Button */}
        <button
          onClick={onNewSession}
          className="m-4 p-3 bg-[var(--button-primary)] text-[var(--button-primary-text)] rounded-lg hover:opacity-90 flex items-center justify-center gap-2 transition-opacity min-h-[44px]"
          aria-label="Start new conversation"
        >
          <Plus size={20} />
          New Chat
        </button>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-2">
          {sessions.map((session) => (
            <div key={session.id} className="group">
              <button
                onClick={() => {
                  onSelectSession(session.id);
                  onClose();
                }}
                className={`w-full text-left p-3 rounded-lg transition-colors truncate min-h-[44px] flex items-center ${
                  currentSessionId === session.id
                    ? 'bg-[var(--bg-secondary)]'
                    : 'hover:bg-[var(--bg-secondary)]'
                }`}
                title={session.title}
              >
                <span className="text-sm truncate">{session.title}</span>
              </button>
              <button
                onClick={() => onDeleteSession(session.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded float-right"
                aria-label={`Delete conversation: ${session.title}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[var(--border)] space-y-2">
          <button
            onClick={onShowSavedAnswers}
            className="w-full p-3 hover:bg-[var(--bg-secondary)] rounded-lg flex items-center gap-2 transition-colors min-h-[44px]"
            aria-label="View saved answers"
          >
            <BookmarkOpen size={20} />
            <span className="text-sm">Saved Answers</span>
          </button>

          <button
            onClick={onShowInfo}
            className="w-full p-3 hover:bg-[var(--bg-secondary)] rounded-lg flex items-center gap-2 transition-colors min-h-[44px]"
            aria-label="View college information"
          >
            <Info size={20} />
            <span className="text-sm">College Info</span>
          </button>

          <button
            onClick={onToggleDarkMode}
            className="w-full p-3 hover:bg-[var(--bg-secondary)] rounded-lg flex items-center gap-2 transition-colors min-h-[44px]"
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span className="text-sm">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
