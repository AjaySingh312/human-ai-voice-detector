import React, { useState } from "react";
import Layout from "./components/Layout.jsx";
import UploadCard from "./components/UploadCard.jsx";
import ResultCard from "./components/ResultCard.jsx";
import LoadingOverlay from "./components/LoadingOverlay.jsx";
import ErrorBanner from "./components/ErrorBanner.jsx";

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (file) => {
    setSelectedFile(file);
    setAnalysisResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError("Please select an audio file to analyze.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/audio/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const message = data?.error?.message || "Failed to analyze audio.";
        throw new Error(message);
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {loading && <LoadingOverlay />}
      {error && <ErrorBanner message={error} onClose={() => setError(null)} />}
      <div className="page-grid">
        <UploadCard
          selectedFile={selectedFile}
          onFileChange={handleFileChange}
          onAnalyze={handleAnalyze}
          loading={loading}
        />
        <ResultCard result={analysisResult} />
      </div>
    </Layout>
  );
};

export default App;
