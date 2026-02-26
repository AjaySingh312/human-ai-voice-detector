🚀 Project README

👥 Team Name

Team courage

📌 Project Name

AI Voice Detection System

❓ Problem Statement (P)

Fake AI-generated voices are increasing rapidly and can be used for scams, impersonation, and misinformation. This project detects whether a voice recording is AI-generated or human using AI models.

🧠 Track

Open innovation

👨‍💻 Team Members

Ajay Singh – Frontend Developer (React) AND Backend Developer (Node.js + Express)

Raghvendra Singh – Testing

Pranjal Gupta – UI Designer

Vishwajit Singh – Documentation


## Human vs AI Voice Detector

Upload an audio file, send it to a Node.js backend, run a lightweight AI-style analysis, and see a polished visualization of the result in a modern React UI.


---

### Project structure

- **backend**: Node.js + Express REST API for file upload and audio "AI" analysis  
- **frontend**: React (Vite) single-page app with a modern glassmorphism UI

```text
project-root/
  backend/
    package.json
    src/
      index.js
      server.js
      routes/
        audioRoutes.js
      controllers/
        audioController.js
      services/
        aiService.js
      uploads/        # created at runtime for temp files
  frontend/
    package.json
    vite.config.js
    index.html
    src/
      main.jsx
      App.jsx
      components/
        Layout.jsx
        UploadCard.jsx
        ResultCard.jsx
        LoadingOverlay.jsx
        ErrorBanner.jsx
      styles/
        globals.css
```

---

### Requirements

- Node.js 18+ and npm
- Runs locally in VS Code or any editor

---

### Backend setup (Node.js + Express + Gemini)

From the project root:

```bash
cd backend
npm install
```

Start the backend:

```bash
npm run dev
```

By default the server runs on `http://localhost:5000`. If port 5000 is already in use (common), create `backend/.env` with `PORT=5050` and restart.

#### Backend features (with Gemini)

- `POST /api/audio/analyze`
  - Accepts a single audio file via `multipart/form-data` under the field name `file`
  - Validates file type (must be `audio/*`)
  - Temporarily stores the upload, passes it to the AI service, then deletes the temp file
  - Returns:
    - File metadata (name, type, size)
    - A "verdict" string
    - Metrics (voice clarity, noise level, speech probability)
    - Human-readable insights

The "AI" logic is encapsulated in `aiService.js` and calls the **Google Gemini API**. You must provide a Gemini API key (see below) for analysis to work.

#### Configure Gemini

1. Go to Google AI Studio and create an API key for Gemini.
2. Copy `backend/.env.example` to `backend/.env`.
3. Fill in:

```env
GEMINI_API_KEY=your_real_key_here
GEMINI_MODEL=gemini-1.5-flash
```
```in aiService.js at line no. 29 also add api key ```

4. Restart the backend (`npm run dev`).

> **Note:** the service now resolves the `.env` file relative to the `backend` folder
> so you can start the server from the project root, but if you still see the
> `GEMINI_API_KEY is not set` error double‑check that your `.env` file exists and
> that the backend process is restarted after you add the key.

---

### Frontend setup (React + Vite)

In a second terminal, from the project root:

```bash
cd frontend
npm install
```

Start the dev server:

```bash
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies `/api/*` requests to the backend. By default it targets `http://localhost:5050` (to avoid common port conflicts). You can override by setting `VITE_BACKEND_URL` before starting the frontend.

---

### How to use

1. Start the **backend** (`npm run dev` in `backend/`)
2. Start the **frontend** (`npm run dev` in `frontend/`)
3. Open `http://localhost:5173` in your browser
4. Drag & drop or browse for an audio file (mp3, wav, m4a, etc.)
5. Click **Analyze Audio**
6. Watch the **verdict**, **metrics**, and **insights** appear with animated visual bars and a glassy UI

The app includes:

- Loading overlay while the backend is processing
- Error banner for validation or network failures
- Clean separation between upload state and analysis result

---

### API contract

**Request**

- `POST /api/audio/analyze`
- `Content-Type: multipart/form-data`
- Field: `file` (single audio file)

**Successful response (200)**

```json
{
  "success": true,
  "file": {
    "name": "sample.wav",
    "mimeType": "audio/wav",
    "size": 123456
  },
  "analysis": {
    "verdict": "Likely Human Voice",
    "metrics": {
      "voiceClarity": 92,
      "noiseLevel": 18,
      "speechProbability": 88
    },
    "insights": [
      "Voice clarity scored at 92 out of 100.",
      "Background noise level estimated at 18 out of 100.",
      "Probability of clear speech presence is around 88%.",
      "Combine these metrics to judge whether the recording feels more human-like or synthetic."
    ],
    "meta": {
      "fileName": "sample.wav",
      "mimeType": "audio/wav",
      "size": 123456,
      "tempPath": "backend/uploads/audio-....wav",
      "hash": "abcd1234",
      "analyzedAt": "2026-02-26T12:34:56.789Z"
    }
  }
}
```

**Error response (e.g., 400 / 500)**

```json
{
  "error": {
    "message": "Human-readable error description"
  }
}
```

---

### Swapping in a real AI API (optional)

To connect a real AI provider:

1. Open `backend/src/services/aiService.js`
2. Replace the mock implementation with a call to your AI API of choice (e.g., OpenAI, custom model endpoint)
3. Use environment variables (via `.env` and `dotenv`) for API keys
4. Shape the returned JSON so it still matches:
   - `verdict` (string)
   - `metrics` (object with numeric fields)
   - `insights` (array of strings)

This way the frontend does not need to change at all.

---

### Demo talking points for judges

- **Clear story**: “We detect whether an audio snippet sounds more human or AI-generated, and we show why.”
- **Clean architecture**: React/Vite SPA, Node/Express API, single upload endpoint, and a dedicated AI service layer.
- **Production-friendly UX**:
  - Drag & drop upload
  - Smooth loading overlay
  - Confident verdict pill + visual metric bars
  - Error handling for invalid files or offline backend
- **Extensibility**: Swap in any AI provider or model without touching the UI or routing.

---

### Running in VS Code

- Open the project root in VS Code
- Use the built-in terminals:
  - Terminal 1 → `cd backend && npm install && npm run dev`
  - Terminal 2 → `cd frontend && npm install && npm run dev`
- Optionally add VS Code launch configs if you want one-click run, but the above is all you need for local development and demo.

