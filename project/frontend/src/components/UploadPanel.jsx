import { useRef } from 'react';

export default function UploadPanel({ onFileSelect, file, disabled }) {
  const inputRef = useRef(null);

  const handleChange = (event) => {
    const selected = event.target.files?.[0];
    if (selected) {
      onFileSelect(selected);
    }
  };

  return (
    <div className="glass-card upload-panel">
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        onChange={handleChange}
        disabled={disabled}
        hidden
      />

      <h2>Upload Audio Evidence</h2>
      <p>Drop your clip from meetings, podcasts, or social media and get an AI authenticity risk report.</p>

      <button
        className="primary-btn"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
      >
        Choose Audio File
      </button>

      <p className="file-label">{file ? `Selected: ${file.name}` : 'Accepted formats: MP3, WAV, M4A, AAC, OGG'}</p>
    </div>
  );
}
