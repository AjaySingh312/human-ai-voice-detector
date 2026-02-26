import React from "react";

const MetricBar = ({ label, value }) => {
  return (
    <div className="metric-row">
      <div className="metric-label">
        <span>{label}</span>
        <span className="metric-value">{value}</span>
      </div>
      <div className="metric-bar">
        <div
          className="metric-bar-fill"
          style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        />
      </div>
    </div>
  );
};

const ResultCard = ({ result }) => {
  if (!result) {
    return (
      <section className="card result-card empty">
        <h2>2. See AI-style analysis</h2>
        <p className="card-subtitle">
          Run an analysis to reveal verdict, metrics, and insights about your audio.
        </p>
        <div className="placeholder">
          <div className="placeholder-pulse" />
          <p>Results will appear here.</p>
        </div>
      </section>
    );
  }

  const { file, analysis } = result;
  const { verdict, metrics, insights } = analysis || {};

  return (
    <section className="card result-card">
      <h2>Analysis Result</h2>
      <p className="card-subtitle">We analyzed your audio and generated the following insights.</p>

      <div className="pill-row">
        <span className="pill pill-strong">Verdict</span>
        <span className="pill pill-soft">{verdict}</span>
      </div>

      <div className="metrics-grid">
        {metrics && (
          <>
            <MetricBar label="Voice clarity" value={metrics.voiceClarity} />
            <MetricBar label="Noise level" value={metrics.noiseLevel} />
            <MetricBar
              label="Speech probability"
              value={metrics.speechProbability}
            />
          </>
        )}
      </div>

      <div className="insights">
        <h3>Key Insights</h3>
        <ul>
          {insights?.map((line, index) => (
            <li key={index}>{line}</li>
          ))}
        </ul>
      </div>

      {file && (
        <div className="file-meta">
          <h3>File details</h3>
          <p className="file-name">{file.name}</p>
          <p className="file-info">
            {file.mimeType} • {(file.size / 1024).toFixed(1)} KB
          </p>
        </div>
      )}
    </section>
  );
};

export default ResultCard;
