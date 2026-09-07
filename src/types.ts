// Chat message types
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  files?: UploadedFile[]
}

// File upload types
export interface UploadedFile {
  id: string
  originalName: string
  filename: string
  mimeType: string
  size: number
  status: 'uploading' | 'success' | 'error'
}

// Chat session
export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}

// Saved answer bookmark
export interface SavedAnswer {
  id: string
  question: string
  answer: string
  timestamp: Date
  sessionId: string
}

// API Request/Response types
export interface ChatRequest {
  messages: Array<{
    role: 'user' | 'assistant'
    parts: Array<{ text: string }>
  }>
  activeFiles?: UploadedFile[]
}

export interface ChatResponse {
  type: 'status' | 'success' | 'error'
  message?: string
  text?: string
  userMessage?: string
}

// Knowledge base type
export interface KnowledgeBase {
  college: {
    name: string
    shortName: string
    established: number
    sponsorship: string
    affiliation: string
    approval: string
    eamcetCode: string
    ecetCode: string
    location: {
      address: string
      phone: string
      website: string
    }
    courses: Array<{
      degree: string
      duration: string
      branches: string[]
    }>
  }
}
