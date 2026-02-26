import React from "react";

const LoadingOverlay = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="spinner" />
        <div className="loading-text">
          <p>Analyzing audio...</p>
          <p className="loading-subtitle">
            Running signal checks, estimating clarity and speech probability.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
