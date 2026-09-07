import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatArea from './components/ChatArea';
import Sidebar from './components/Sidebar';
import UploadModal from './components/UploadModal';
import InfoModal from './components/InfoModal';
import SavedAnswersModal from './components/SavedAnswersModal';
import type { ChatSession, ChatMessage, SavedAnswer, UploadedFile } from './types';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [savedAnswers, setSavedAnswers] = useState<SavedAnswer[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSavedAnswers, setShowSavedAnswers] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Initialize with first session
  useEffect(() => {
    const newSession: ChatSession = {
      id: uuidv4(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setChatSessions([newSession]);
    setCurrentSessionId(newSession.id);

    // Apply theme
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Update theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const currentSession = chatSessions.find(s => s.id === currentSessionId);

  const handleSendMessage = async (message: string) => {
    if (!currentSession) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: message,
      timestamp: new Date(),
      files: uploadedFiles.length > 0 ? [...uploadedFiles] : undefined
    };

    const updatedMessages = [...currentSession.messages, userMessage];
    
    // Update session with user message
    setChatSessions(sessions =>
      sessions.map(s =>
        s.id === currentSessionId
          ? {
              ...s,
              messages: updatedMessages,
              title: updatedMessages.length === 1 ? message.substring(0, 30) : s.title,
              updatedAt: new Date()
            }
          : s
      )
    );

    // Update sidebar to show new session if first message
    setIsSidebarOpen(false);

    try {
      // Stream response from server
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({
            role: m.role,
            parts: [{ text: m.content }]
          })),
          activeFiles: uploadedFiles
        })
      });

      if (!response.ok) throw new Error('Chat request failed');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response stream');

      let assistantMessage = '';
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              
              if (data.type === 'stream') {
                assistantMessage += data.text;
              } else if (data.type === 'success') {
                assistantMessage = data.text;
              } else if (data.type === 'error') {
                assistantMessage = data.userMessage || 'An error occurred.';
              }

              // Update assistant message in real-time
              setChatSessions(sessions =>
                sessions.map(s => {
                  if (s.id === currentSessionId) {
                    const msgs = [...s.messages];
                    if (msgs.length > 0 && msgs[msgs.length - 1].role === 'assistant') {
                      msgs[msgs.length - 1] = {
                        ...msgs[msgs.length - 1],
                        content: assistantMessage
                      };
                    } else {
                      msgs.push({
                        id: uuidv4(),
                        role: 'assistant',
                        content: assistantMessage,
                        timestamp: new Date()
                      });
                    }
                    return {
                      ...s,
                      messages: msgs,
                      updatedAt: new Date()
                    };
                  }
                  return s;
                })
              );
            } catch (e) {
              console.error('Parse error:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setChatSessions(sessions =>
        sessions.map(s =>
          s.id === currentSessionId
            ? {
                ...s,
                messages: [
                  ...s.messages,
                  {
                    id: uuidv4(),
                    role: 'assistant',
                    content: 'I am having trouble reaching the AI service. Please try again.',
                    timestamp: new Date()
                  }
                ]
              }
            : s
        )
      );
    }
  };

  const handleNewSession = () => {
    const newSession: ChatSession = {
      id: uuidv4(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setChatSessions([newSession, ...chatSessions]);
    setCurrentSessionId(newSession.id);
    setUploadedFiles([]);
  };

  const handleDeleteSession = (sessionId: string) => {
    const updated = chatSessions.filter(s => s.id !== sessionId);
    setChatSessions(updated);
    if (currentSessionId === sessionId) {
      setCurrentSessionId(updated[0]?.id || '');
    }
  };

  const handleSaveAnswer = (question: string, answer: string) => {
    const newSavedAnswer: SavedAnswer = {
      id: uuidv4(),
      question,
      answer,
      timestamp: new Date(),
      sessionId: currentSessionId
    };
    setSavedAnswers([...savedAnswers, newSavedAnswer]);
  };

  const handleFilesSelected = (files: UploadedFile[]) => {
    setUploadedFiles(files);
  };

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        sessions={chatSessions}
        currentSessionId={currentSessionId}
        onSelectSession={setCurrentSessionId}
        onNewSession={handleNewSession}
        onDeleteSession={handleDeleteSession}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onShowSavedAnswers={() => setShowSavedAnswers(true)}
        onShowInfo={() => setShowInfoModal(true)}
      />

      {/* Main chat area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatArea
          session={currentSession}
          uploadedFiles={uploadedFiles}
          onSendMessage={handleSendMessage}
          onOpenUploadModal={() => setShowUploadModal(true)}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onSaveAnswer={handleSaveAnswer}
        />
      </div>

      {/* Modals */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onFilesSelected={handleFilesSelected}
          currentFiles={uploadedFiles}
        />
      )}

      {showInfoModal && (
        <InfoModal onClose={() => setShowInfoModal(false)} />
      )}

      {showSavedAnswers && (
        <SavedAnswersModal
          savedAnswers={savedAnswers}
          onClose={() => setShowSavedAnswers(false)}
        />
      )}
    </div>
  );
}
