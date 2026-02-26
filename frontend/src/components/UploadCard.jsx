import React, { useRef } from "react";

const UploadCard = ({ selectedFile, onFileChange, onAnalyze, loading }) => {
  const fileInputRef = useRef(null);

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onFileChange(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileChange(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <section className="card upload-card">
      <h2>1. Upload your audio file</h2>
      <p className="card-subtitle">
        Drag &amp; drop or browse to select an audio snippet you want to inspect.
      </p>
      <div
        className="dropzone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileInputChange}
          style={{ display: "none" }}
        />
        <div className="dropzone-icon">🎧</div>
        <p className="dropzone-text">
          {selectedFile
            ? selectedFile.name
            : "Drop an audio file here or click below"}
        </p>
        <button
          type="button"
          className="btn-secondary"
          onClick={handleBrowseClick}
          disabled={loading}
        >
          Browse files
        </button>
      </div>

      <div className="upload-footer">
        <div className="hint">
          <span className="hint-dot" />
          <span>Supports common audio formats (mp3, wav, m4a, etc.).</span>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={onAnalyze}
          disabled={!selectedFile || loading}
        >
          {loading ? "Analyzing..." : "Analyze Audio"}
        </button>
      </div>
    </section>
  );
};

export default UploadCard;
