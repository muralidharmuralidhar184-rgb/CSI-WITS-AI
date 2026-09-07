import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Menu, BookmarkPlus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { ChatSession, UploadedFile, SavedAnswer } from '../types';

interface ChatAreaProps {
  session?: ChatSession;
  uploadedFiles: UploadedFile[];
  onSendMessage: (message: string) => void;
  onOpenUploadModal: () => void;
  onOpenSidebar: () => void;
  onSaveAnswer: (question: string, answer: string) => void;
}

export default function ChatArea({
  session,
  uploadedFiles,
  onSendMessage,
  onOpenUploadModal,
  onOpenSidebar,
  onSaveAnswer
}: ChatAreaProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session?.messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    const message = input;
    setInput('');

    try {
      await onSendMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSaveAnswer = (question: string, answer: string) => {
    onSaveAnswer(question, answer);
    alert('Answer saved to Bookmarks!');
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 hover:bg-[var(--surface-elevated)] rounded-lg"
          aria-label="Open Navigation Menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="flex-1 text-lg font-semibold text-center">CSI WITS AI</h1>
        <div className="w-8" /> {/* Spacer */}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {(!session || session.messages.length === 0) ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-6xl mb-4">◆</div>
            <h2 className="text-2xl font-semibold mb-2">Welcome to CSI WITS AI</h2>
            <p className="text-[var(--text-muted)] max-w-sm">
              Ask me anything about college policies, courses, fees, exams, or upload study materials for assistance.
            </p>
          </div>
        ) : (
          session.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-2xl px-4 py-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-[var(--button-primary)] text-[var(--button-primary-text)]'
                    : 'bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border)]'
                }`}
              >
                {message.role === 'assistant' ? (
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}

                {message.role === 'assistant' && (
                  <button
                    onClick={() => handleSaveAnswer(
                      session.messages[session.messages.indexOf(message) - 1]?.content || 'Question',
                      message.content
                    )}
                    className="mt-2 flex items-center gap-2 text-sm opacity-70 hover:opacity-100 transition-opacity"
                    aria-label="Save answer"
                  >
                    <BookmarkPlus size={16} />
                    Save Answer
                  </button>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* File attachments display */}
      {uploadedFiles.length > 0 && (
        <div className="px-4 py-2 bg-[var(--surface-elevated)] border-t border-[var(--border)]">
          <p className="text-sm text-[var(--text-muted)] mb-2">Attached Files:</p>
          <div className="flex flex-wrap gap-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="bg-[var(--bg-primary)] px-3 py-1 rounded border border-[var(--border)] text-sm"
              >
                {file.originalName}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-primary)]">
        <div className="flex gap-2 mb-2">
          <button
            onClick={onOpenUploadModal}
            className="p-2 hover:bg-[var(--surface-elevated)] rounded-lg transition-colors"
            aria-label="Attach study materials"
            title="Upload files (max 9 files, 500MB each)"
          >
            <Paperclip size={20} />
          </button>
        </div>

        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question or describe your topic..."
            className="flex-1 p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-muted)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--button-primary)] min-h-12"
            disabled={isLoading}
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="p-3 bg-[var(--button-primary)] text-[var(--button-primary-text)] rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity min-w-[44px] flex items-center justify-center"
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
