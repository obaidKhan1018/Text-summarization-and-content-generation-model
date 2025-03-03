import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Import styles

const API_BASE_URL = "http://127.0.0.1:8000"; // Backend API URL

function App() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!text) {
      alert("Please enter text to summarize!");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/summarize/`, { text });
      setSummary(response.data.summary);
    } catch (error) {
      console.error("Error summarizing text:", error);
    }
    setLoading(false);
  };

  const handleGenerateContent = async () => {
    if (!prompt) {
      alert("Please enter a prompt for content generation!");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/generate/`, { prompt });
      setGeneratedText(response.data.generated_text);
    } catch (error) {
      console.error("Error generating content:", error);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Text Summarization & Content Generation</h1>

      <div className="section">
        <h2>Text Summarization</h2>
        <textarea
          placeholder="Enter text to summarize..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={handleSummarize} disabled={loading}>
          {loading ? "Summarizing..." : "Summarize"}
        </button>
        {summary && (
          <div className="result">
            <h3>Summary:</h3>
            <p>{summary}</p>
          </div>
        )}
      </div>

      <div className="section">
        <h2>Content Generation</h2>
        <textarea
          placeholder="Enter a prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button onClick={handleGenerateContent} disabled={loading}>
          {loading ? "Generating..." : "Generate Content"}
        </button>
        {generatedText && (
          <div className="result">
            <h3>Generated Text:</h3>
            <p>{generatedText}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
