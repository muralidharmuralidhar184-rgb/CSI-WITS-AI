import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Environment setup
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is required');
}

const app = express();
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Models
const PRIMARY_MODEL = 'gemini-2.0-flash';
const FALLBACK_MODEL = 'gemini-1.5-flash';
const MAX_ATTEMPTS_PER_MODEL = 3;

// Upload configuration
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    cb(null, `${timestamp}-${randomStr}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB
  }
});

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// Knowledge base
const knowledgeBase = {
  college: {
    name: 'CSI Wesley Institute of Technology and Sciences',
    shortName: 'CSI WITS',
    established: 2015,
    sponsorship: 'Church of South India Medak Diocese',
    affiliation: 'Jawaharlal Nehru Technological University, Hyderabad (JNTUH)',
    approval: 'AICTE, New Delhi',
    eamcetCode: 'WESL',
    ecetCode: 'WESL',
    location: {
      address: 'CFRP+5MC, PG Road, Sappu Bagh Apartment, Nallagutta, Begumpet, Hyderabad, Telangana 500003',
      phone: '040 27818137',
      website: 'https://wesleyengineeringcollege.com/'
    },
    courses: [
      {
        degree: 'B.Tech',
        duration: '4 Years',
        branches: [
          'Computer Science and Engineering (CSE)',
          'CSE - Artificial Intelligence & Machine Learning (AI&ML)',
          'CSE - Data Science',
          'Electronics & Communication Engineering (ECE)',
          'Electrical & Electronics Engineering (EEE)'
        ]
      }
    ]
  }
};

// System prompt for AI
const SYSTEM_PROMPT = `You are CSI WITS AI, an intelligent academic assistant for CSI Wesley Institute of Technology and Sciences students.

INSTITUTIONAL CONTEXT:
${JSON.stringify(knowledgeBase, null, 2)}

RESPONSE FORMATTING RULES:
1. Direct Answer: Start with a concise headline answering the question
2. Simple Definition: Clear explanation without unnecessary jargon
3. Step-by-Step Explanation: Bulleted or numbered breakdown
4. Real-Life Example: Practical context in everyday terms
5. Key Points: Bulleted summary of essential facts
6. Related Questions: 3 follow-up prompts formatted as interactive buttons

CONSTRAINTS:
- Use monochrome/black-and-white terminology only
- No color-based communication
- Maintain academic rigor and clarity
- Prioritize institutional knowledge when relevant
- Be helpful, accurate, and student-focused`;

// Helper function to read file content
async function readFileContent(filePath: string): Promise<string | Buffer> {
  const ext = path.extname(filePath).toLowerCase();
  
  if (['.txt', '.csv', '.json', '.md', '.log'].includes(ext)) {
    return fs.readFileSync(filePath, 'utf-8');
  }
  
  // For binary files, read as base64
  return fs.readFileSync(filePath);
}

// Helper function to get MIME type
function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.pdf': 'application/pdf',
    '.txt': 'text/plain',
    '.csv': 'text/csv',
    '.json': 'application/json',
    '.md': 'text/markdown',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif'
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

// Upload endpoint
app.post('/api/upload', upload.array('files', 9), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const files = (req.files as Express.Multer.File[]).map(file => ({
      id: uuidv4(),
      originalName: file.originalname,
      filename: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      status: 'success'
    }));

    res.json({
      message: `Successfully uploaded ${files.length} file(s)`,
      files
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Chat endpoint with SSE streaming
app.post('/api/chat', async (req, res) => {
  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const { messages, activeFiles } = req.body;

    if (!messages || messages.length === 0) {
      res.write(`data: ${JSON.stringify({ type: 'error', userMessage: 'No messages provided' })}\n\n`);
      res.end();
      return;
    }

    // Prepare file content for context
    let fileContext = '';
    if (activeFiles && activeFiles.length > 0) {
      for (const file of activeFiles) {
        const filePath = path.join(uploadsDir, file.filename);
        try {
          const content = await readFileContent(filePath);
          fileContext += `\n\n--- File: ${file.originalName} ---\n`;
          fileContext += typeof content === 'string' ? content : content.toString('base64');
        } catch (err) {
          console.error(`Error reading file ${file.filename}:`, err);
        }
      }
    }

    // Attempt with primary and fallback models
    let response = null;
    let lastError = null;

    for (const model of [PRIMARY_MODEL, FALLBACK_MODEL]) {
      for (let attempt = 1; attempt <= MAX_ATTEMPTS_PER_MODEL; attempt++) {
        try {
          if (attempt > 1) {
            res.write(`data: ${JSON.stringify({ type: 'status', message: `Retrying... (Attempt ${attempt}/${MAX_ATTEMPTS_PER_MODEL})` })}\n\n`);
            // Exponential backoff
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt - 1) * 1000));
          }

          const genModel = genAI.getGenerativeModel({ model });
          
          // Build combined context
          const userMessage = messages[messages.length - 1];
          const combinedPrompt = `${SYSTEM_PROMPT}\n\n${fileContext}\n\nUser Question: ${userMessage.parts[0].text}`;

          const stream = await genModel.generateContentStream({
            contents: [{
              role: 'user',
              parts: [{ text: combinedPrompt }]
            }]
          });

          let fullText = '';
          for await (const chunk of stream.stream) {
            const chunkText = chunk.text();
            fullText += chunkText;
            res.write(`data: ${JSON.stringify({ type: 'stream', text: chunkText })}\n\n`);
          }

          response = fullText;
          break;
        } catch (error: any) {
          lastError = error;
          
          // Check if it's a rate limit or server error
          if (error.status === 429 || error.status === 500 || error.status === 503) {
            if (attempt === MAX_ATTEMPTS_PER_MODEL) {
              // Switch to fallback model
              if (model === PRIMARY_MODEL) {
                res.write(`data: ${JSON.stringify({ type: 'status', message: 'Switching to backup model...' })}\n\n`);
              }
            }
            continue;
          } else {
            throw error;
          }
        }
      }

      if (response) break;
    }

    if (!response) {
      res.write(`data: ${JSON.stringify({ type: 'error', userMessage: 'I am having trouble reaching the AI service. Please try again in a moment.' })}\n\n`);
    } else {
      res.write(`data: ${JSON.stringify({ type: 'success', text: response })}\n\n`);
    }

    res.end();
  } catch (error: any) {
    console.error('Chat error:', error);
    res.write(`data: ${JSON.stringify({ type: 'error', userMessage: 'An error occurred while processing your request.' })}\n\n`);
    res.end();
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`CSI WITS AI Server running on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`Primary Model: ${PRIMARY_MODEL}`);
  console.log(`Fallback Model: ${FALLBACK_MODEL}`);
});
