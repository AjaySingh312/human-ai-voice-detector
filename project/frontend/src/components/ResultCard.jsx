function confidenceTone(confidence = 0) {
  if (confidence >= 75) return 'high';
  if (confidence >= 50) return 'medium';
  return 'low';
}

export default function ResultCard({ result }) {
  if (!result) return null;

  const parsed = result.analysis.parsed;
  const confidence = parsed?.confidence ?? 0;
  const tone = confidenceTone(confidence);

  return (
    <div className="glass-card result-card">
      <div className="result-header">
        <div>
          <p className="muted">Verdict</p>
          <h3>{parsed?.verdict || 'Result unavailable'}</h3>
        </div>
        <span className={`confidence-pill ${tone}`}>{confidence}% confidence</span>
      </div>

      <p>{parsed?.summary || result.analysis.raw || 'No summary provided.'}</p>

      {parsed?.indicators?.length ? (
        <div>
          <p className="muted">Indicators</p>
          <ul>
            {parsed.indicators.map((indicator) => (
              <li key={indicator}>{indicator}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {parsed?.recommendation ? (
        <div>
          <p className="muted">Recommendation</p>
          <p>{parsed.recommendation}</p>
        </div>
      ) : null}

      <p className="provider">Engine: {result.analysis.provider}</p>
    </div>
  );
}
