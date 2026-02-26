import { useState } from 'react';
import UploadPanel from './components/UploadPanel';
import ResultCard from './components/ResultCard';
import { analyzeAudioFile } from './services/api';

export default function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please choose an audio file before running analysis.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const payload = await analyzeAudioFile(file);
      setResult(payload);
    } catch (err) {
      setResult(null);
      setError(err.message || 'Something went wrong while analyzing the file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="hero-bg" />
      <main className="container">
        <header>
          <span className="badge">Hackathon Ready</span>
          <h1>VoiceShield AI</h1>
          <p className="tagline">
            Detect synthetic voice risks in seconds. Upload audio, trigger backend AI analysis, and present
            evidence-grade insights in one polished flow.
          </p>
        </header>

        <UploadPanel onFileSelect={setFile} file={file} disabled={loading} />

        <button className="analyze-btn" onClick={handleAnalyze} disabled={loading}>
          {loading ? 'Analyzing audio…' : 'Run Authenticity Analysis'}
        </button>

        {error ? <p className="error-banner">{error}</p> : null}

        {loading ? <div className="loader">Crunching waveform signatures and metadata…</div> : null}

        <ResultCard result={result} />
      </main>
    </div>
  );
}
