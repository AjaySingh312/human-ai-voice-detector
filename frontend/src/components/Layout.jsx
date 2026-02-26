import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="app-root">
      <div className="app-background" />
      <header className="app-header">
        <div className="app-header-inner">
          <div className="brand">
            <div className="brand-logo">HV</div>
            <div className="brand-text">
              <h1>Human vs AI Voice Detector</h1>
              <p>Upload audio. Get instant AI-style insights.</p>
            </div>
          </div>
          <div className="badge">Hackathon Edition</div>
        </div>
      </header>
      <main className="app-main">{children}</main>
      <footer className="app-footer">
        <span>Built with React &amp; Node.js</span>
        <span className="separator">•</span>
        <span>Designed for live demos</span>
      </footer>
    </div>
  );
};

export default Layout;
