# CSI WITS AI Deployment Guide

## Deployment Options

### Option 1: Google Cloud Run (Recommended - Free tier available)

#### Prerequisites:
- Google Cloud Account
- Google Cloud CLI installed
- Gemini API key

#### Steps:

1. **Create a `.gcloudignore` file:**
```bash
node_modules/
npm-debug.log
.git
.env
uploads/*
dist/
```

2. **Deploy:**
```bash
# Login to Google Cloud
gcloud auth login

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Deploy
gcloud run deploy csi-wits-ai \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key_here \
  --memory 512Mi \
  --timeout 3600
```

3. **Access your app** - Google Cloud will provide a URL like:
   `https://csi-wits-ai-xxxxx.run.app`

---

### Option 2: Heroku (Simple, Free alternative)

#### Prerequisites:
- Heroku Account
- Heroku CLI installed

#### Steps:

1. **Create Procfile:**
```
web: npm run build && npm start
```

2. **Add Buildpacks:**
```bash
heroku buildpacks:add heroku/nodejs
```

3. **Deploy:**
```bash
heroku login
heroku create csi-wits-ai
heroku config:set GEMINI_API_KEY=your_key_here
git push heroku main
```

4. **View logs:**
```bash
heroku logs --tail
```

---

### Option 3: Railway (Modern & Easy)

#### Steps:

1. **Push to GitHub** (if not already done)

2. **Go to railway.app**
   - Connect GitHub account
   - Create new project
   - Select your CSI-WITS-AI repo

3. **Add Environment Variables:**
   - Go to Variables
   - Add `GEMINI_API_KEY=your_key_here`
   - Add `PORT=3000`

4. **Deploy** - Railway auto-deploys on git push

---

### Option 4: Docker + VPS (Full Control)

#### Prerequisites:
- VPS with Docker installed (DigitalOcean, Linode, AWS EC2, etc.)
- SSH access

#### Steps:

1. **Build Docker image:**
```bash
docker build -t csi-wits-ai .
```

2. **Test locally:**
```bash
docker run -p 3000:3000 \
  -e GEMINI_API_KEY=your_key_here \
  csi-wits-ai
```

3. **Push to Docker Hub:**
```bash
docker login
docker tag csi-wits-ai username/csi-wits-ai
docker push username/csi-wits-ai
```

4. **On VPS, run:**
```bash
docker pull username/csi-wits-ai
docker run -d -p 80:3000 \
  -e GEMINI_API_KEY=your_key_here \
  --name csi-wits-ai \
  username/csi-wits-ai
```

---

### Option 5: Vercel + Backend Separately

**Frontend:** Deploy to Vercel (free)
**Backend:** Deploy to Railway/Cloud Run

1. **Split the repo structure** (create separate backend folder)
2. **Deploy frontend to Vercel**
3. **Update API calls to backend URL**
4. **Deploy backend separately**

---

## Recommended Setup (Best Practice)

### **Google Cloud Run + Cloud Storage**

1. **Deploy App:**
```bash
gcloud run deploy csi-wits-ai \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key \
  --memory 1Gi \
  --timeout 3600
```

2. **Use Cloud Storage for uploads** (instead of local `/uploads`):
   - More scalable
   - Persistent storage
   - Auto-cleanup options

3. **Add Cloud Firestore** for chat history (optional)

4. **Set up monitoring:**
```bash
gcloud run services describe csi-wits-ai --region us-central1
```

---

## Environment Variables Checklist

For any deployment, set these:

| Variable | Value | Example |
|----------|-------|---------|
| `GEMINI_API_KEY` | Your Google Gemini API key | `AIzaSy...` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `production` |

---

## Performance Optimization

Before deploying, add to `.env`:

```env
# Production settings
NODE_ENV=production
PORT=3000
GEMINI_API_KEY=your_key_here

# Optional: Add upload limits
MAX_UPLOAD_SIZE=536870912  # 500MB in bytes
MAX_FILES=9
```

---

## Troubleshooting

### "GEMINI_API_KEY is required"
- ✅ Make sure env variable is set in your platform

### "Port 3000 already in use"
- ✅ Change PORT in environment variables

### "Uploads not persisting"
- ✅ Use Cloud Storage instead of local filesystem

### "API Timeout"
- ✅ Increase timeout in deployment config
- ✅ Cloud Run: `--timeout 3600`
- ✅ Heroku: Configure in Procfile

---

## Quick Deploy Commands

**Google Cloud Run:**
```bash
gcloud run deploy csi-wits-ai --source . --allow-unauthenticated --set-env-vars GEMINI_API_KEY=KEY
```

**Heroku:**
```bash
heroku create && heroku config:set GEMINI_API_KEY=KEY && git push heroku main
```

**Docker (Local):**
```bash
docker run -p 3000:3000 -e GEMINI_API_KEY=KEY csi-wits-ai
```

---

## Domain Setup (After Deployment)

### Google Cloud Run:
```bash
gcloud run services update csi-wits-ai \
  --region us-central1 \
  --update-env-vars CUSTOM_DOMAIN=yourdomain.com
```

### Heroku:
```bash
heroku domains:add yourdomain.com
```

### Custom Domain DNS:
- Point CNAME to your deployment URL
- Update in college's DNS settings

---

**Recommendation:** Start with **Google Cloud Run** - it's free for first million requests, easy to scale, and perfect for this use case!
