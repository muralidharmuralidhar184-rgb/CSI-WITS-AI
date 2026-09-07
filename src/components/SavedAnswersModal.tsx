import React from 'react';
import { X, Trash2 } from 'lucide-react';
import type { SavedAnswer } from '../types';

interface SavedAnswersModalProps {
  savedAnswers: SavedAnswer[];
  onClose: () => void;
}

export default function SavedAnswersModal({
  savedAnswers,
  onClose
}: SavedAnswersModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--surface)] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 border border-[var(--border)]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Saved Answers</h2>
          <button onClick={onClose} className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg" aria-label="Close">
            <X size={24} />
          </button>
        </div>

        {savedAnswers.length === 0 ? (
          <p className="text-center text-[var(--text-muted)] py-8">No saved answers yet. Bookmark answers while chatting!</p>
        ) : (
          <div className="space-y-4">
            {savedAnswers.map((answer) => (
              <div key={answer.id} className="border border-[var(--border)] rounded-lg p-4">
                <p className="font-medium mb-2">{answer.question}</p>
                <p className="text-sm text-[var(--text-muted)] mb-2 line-clamp-3">{answer.answer}</p>
                <p className="text-xs text-[var(--text-muted)]">{new Date(answer.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-6 p-3 rounded-lg bg-[var(--button-primary)] text-[var(--button-primary-text)] hover:opacity-90 min-h-[44px]"
        >
          Close
        </button>
      </div>
    </div>
  );
}
