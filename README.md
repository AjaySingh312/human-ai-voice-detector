# VoiceShield AI – Full-Stack Audio Authenticity Analyzer

VoiceShield AI is a hackathon-ready full-stack app that helps users detect potential AI-generated voice clips.

## What it does

1. User uploads an audio file from the React frontend.
2. Node.js + Express backend receives the file via REST API.
3. Backend invokes an AI analysis layer:
   - Uses external AI API when `AI_API_KEY` is configured.
   - Falls back to local heuristic analysis when no key is provided.
4. Frontend renders the verdict, confidence, indicators, and recommendation in a polished dashboard.

## Project structure

```txt
project/
  backend/
    src/
      config/
      controllers/
      middleware/
      routes/
      services/
      uploads/
      utils/
      server.js
    package.json
  frontend/
    src/
      components/
      services/
      styles/
      App.jsx
      main.jsx
    package.json
  package.json
```

## Tech stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **File Upload:** Multer
- **API style:** REST

## Local setup (VS Code friendly)

### 1) Clone and install

```bash
git clone <your-repo-url>
cd human-ai-voice-detector
npm install --prefix project
npm run install:all --prefix project
```

### 2) Configure env files

```bash
cp project/backend/.env.example project/backend/.env
cp project/frontend/.env.example project/frontend/.env
```

Optional: add `AI_API_KEY` in `project/backend/.env` for real provider integration.

### 3) Run app

```bash
npm run dev --prefix project
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

### 4) Build frontend

```bash
npm run build --prefix project
```

## API endpoints

### `GET /api/health`
Returns API health status.

### `POST /api/analyze`
Upload an audio file using multipart form-data:

- field name: `audio`
- max size: 25MB
- accepted MIME: `audio/*`

Response includes:

- file metadata
- analysis provider
- verdict, confidence, indicators, recommendation

## Notes for hackathon judging

- Modern glassmorphism UI and responsive layout.
- Clear loading states and error handling UX.
- Production-minded backend structure with middleware/services separation.
- Easy to demo even without paid AI key (smart fallback mode).
