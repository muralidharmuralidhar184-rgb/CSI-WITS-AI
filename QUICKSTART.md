# Quick Start Guide

## 🚀 Get Your Chatbot Running in 5 Minutes

### Step 1: Clone & Install (2 min)
```bash
git clone https://github.com/muralidharmuralidhar184-rgb/CSI-WITS-AI.git
cd CSI-WITS-AI
npm install
```

### Step 2: Set Up API Key (1 min)
```bash
# Copy the template
cp .env.example .env

# Get your free Gemini API key:
# Visit: https://aistudio.google.com/app/apikey
# Copy the key and paste it in .env file
```

Edit `.env`:
```env
GEMINI_API_KEY=your_actual_key_here
PORT=3000
NODE_ENV=development
```

### Step 3: Run Locally (1 min)
```bash
npm run dev
```

### Step 4: Open in Browser (1 min)
```
http://localhost:3000
```

That's it! 🎉

---

## 📝 How to Use

1. **Ask Questions:** Type any question about the college
2. **Upload Files:** Click paperclip icon to upload study materials
3. **Save Answers:** Click "Save Answer" to bookmark responses
4. **Switch Chats:** Use sidebar to manage multiple conversations
5. **Toggle Theme:** Dark/Light mode button in sidebar

---

## 🐳 Deploy with Docker (3 commands)

```bash
# Build
docker build -t csi-wits-ai .

# Run locally to test
docker run -p 3000:3000 -e GEMINI_API_KEY=your_key csi-wits-ai

# Push to production (see DEPLOYMENT.md)
```

---

## ☁️ Deploy to Google Cloud Run (Recommended)

```bash
gcloud run deploy csi-wits-ai \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key_here
```

Your app will be live at: `https://csi-wits-ai-xxxxx.run.app`

---

## 📁 Project Structure

```
CSI-WITS-AI/
├── src/
│   ├── components/          # React UI components
│   ├── App.tsx              # Main app
│   ├── main.tsx             # Entry point
│   ├── index.css            # Styles
│   ├── types.ts             # TypeScript types
│   └── data/knowledge.json  # College info
├── server.ts                # Express backend
├── package.json             # Dependencies
├── vite.config.ts           # Build config
├── Dockerfile               # Container setup
├── DEPLOYMENT.md            # Deployment guide
└── README.md                # Full documentation
```

---

## 🔧 Available Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (Vite + Express) |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Type check with TypeScript |

---

## 🐛 Common Issues

### Issue: "GEMINI_API_KEY is required"
**Solution:** Make sure `.env` file exists and has your API key

### Issue: "Port 3000 already in use"
**Solution:** 
```bash
# Kill the process or use different port
PORT=3001 npm run dev
```

### Issue: "Module not found"
**Solution:** 
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Features Checklist

- ✅ AI Chat with Gemini API
- ✅ File Upload (PDFs, Images, Docs)
- ✅ Save/Bookmark Answers
- ✅ Multiple Chat Sessions
- ✅ Dark/Light Theme
- ✅ Mobile Responsive
- ✅ Monochrome Design
- ✅ WCAG Accessible
- ✅ AI Model Failover
- ✅ Docker Ready

---

## 📞 Support

Need help?
1. Check `README.md` for full documentation
2. See `DEPLOYMENT.md` for deployment options
3. Review error messages in browser console (F12)

---

## 🎓 For CSI WITS

This chatbot is pre-configured with:
- College information (location, contact, courses)
- EAMCET code: **WESL**
- Affiliation: **JNTUH Hyderabad**
- Courses: CSE, AI&ML, Data Science, ECE, EEE

To customize:
1. Edit `src/data/knowledge.json` with your college data
2. Update `server.ts` system prompt if needed
3. Redeploy

---

**Happy chatting! 🤖**
