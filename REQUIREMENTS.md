# CSI WITS AI Chatbot Requirements

## 1. Purpose

CSI WITS AI is a student-focused assistant for verified college information, academic questions, and uploaded study materials.

## 2. Functional Requirements

### FR-01: Chat
- Users shall submit natural-language questions.
- The assistant shall return concise answers for simple questions and structured explanations for academic questions.
- Answers shall be grounded in the CSI WITS knowledge base.
- The assistant shall clearly state when verified information is unavailable.
- The interface shall display model errors and provide a retry action.

### FR-02: Institutional Information
- The assistant shall provide verified information about courses, affiliations, approvals, contact details, admissions, facilities, and college policies when available.
- The assistant shall not invent fees, deadlines, admission rules, facilities, or placement claims.
- Responses shall distinguish similar but materially different claims, such as placement support versus students placed.

### FR-03: File Uploads
- Users shall upload up to 9 files per upload operation.
- Each file shall be limited to 500 MB.
- The system shall support text, JSON, CSV, PDF, and multimodal files accepted by the Gemini File API.
- Upload results shall show success or a useful processing error for each file.
- Uploaded files shall be available as context for subsequent questions.

### FR-04: Academic Study Mode
- Academic answers should use relevant sections such as definition, explanation, example, key points, recap, and related questions.
- Related questions shall be presented as actionable follow-up prompts.

### FR-05: Conversations
- Users shall be able to start a new conversation.
- Users shall be able to switch between recent conversations.
- Users shall be able to save and revisit useful answers.

### FR-06: User Interface
- The interface shall support light and dark themes.
- The interface shall be responsive on desktop and mobile screens.
- Controls shall provide accessible labels and keyboard-focus states.
- Loading, retrying, success, and error states shall be communicated with text and recognizable icons.

## 3. Non-Functional Requirements

### NFR-01: Reliability
- Transient Gemini failures, rate limits, and timeouts shall be retried automatically.
- The system shall use a fallback model after primary-model retries are exhausted.
- The user shall receive a clear message when all attempts fail.

### NFR-02: Security
- The Gemini API key shall be stored in server-side environment configuration and never exposed to the browser.
- Uploaded files shall not be returned wholesale to the client.
- Server routes shall validate request shape and upload limits.
- Secrets and environment files shall remain excluded from version control.

### NFR-03: Performance
- Chat responses shall stream status and completion events to the client using Server-Sent Events.
- Gemini requests shall have an internal timeout.
- The client shall remain responsive while uploads and chat requests are in progress.

### NFR-04: Maintainability
- Shared domain types shall be defined in the TypeScript source tree.
- Institutional facts shall be maintained in the knowledge base rather than duplicated in UI components.
- The project shall pass the TypeScript check with `npm run lint` and build with `npm run build`.

### NFR-05: Compatibility
- The development environment shall use Node.js 18 or newer.
- The application shall run locally with `npm run dev`.
- Production output shall be generated with `npm run build` and served with `npm start`.

## 4. Environment Requirements

Create a local `.env` file containing:

```env
GEMINI_API_KEY=your_gemini_api_key
```

The API key must be valid for the Gemini API and must not be committed to Git.

## 5. Acceptance Checklist

- [ ] The app starts with `npm run dev`.
- [ ] The homepage loads at `http://localhost:3000`.
- [ ] A chat question returns a streamed answer when `GEMINI_API_KEY` is configured.
- [ ] Missing or invalid API configuration produces a readable error and retry action.
- [ ] A valid file uploads successfully and can be referenced in a question.
- [ ] The ninth file is accepted and the tenth file is rejected.
- [ ] Files over 500 MB are rejected.
- [ ] Light and dark themes work without layout breakage.
- [ ] Recent conversations and saved answers remain usable during the session.
- [ ] `npm run lint` completes without TypeScript errors.
- [ ] `npm run build` completes successfully.
