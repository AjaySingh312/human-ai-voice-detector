import React from "react";

const ErrorBanner = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="error-banner">
      <div className="error-icon">!</div>
      <div className="error-text">
        <p>{message}</p>
      </div>
      <button type="button" className="error-close" onClick={onClose}>
        ×
      </button>
    </div>
  );
};

export default ErrorBanner;
