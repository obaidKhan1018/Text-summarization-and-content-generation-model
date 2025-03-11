import React, { useState, useEffect } from "react";
import axios from "axios";
import { Sun, Moon, Copy, RefreshCw, Send, Clock, Zap, FileText, History, X } from "lucide-react";
import "./App.css";

const API_BASE_URL = "http://127.0.0.1:8000";

function App() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoadingGeneration, setIsLoadingGeneration] = useState(false);
  const [error, setError] = useState({ summary: "", generation: "" });
  const [recentSummaries, setRecentSummaries] = useState([]);
  const [recentPrompts, setRecentPrompts] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [characterCount, setCharacterCount] = useState({ text: 0, prompt: 0 });
  const [activeTab, setActiveTab] = useState("summarize");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedText, setCopiedText] = useState("");

  // Apply dark mode
  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "";
  }, [darkMode]);

  // Handle character count
  useEffect(() => {
    setCharacterCount({
      text: text.length,
      prompt: prompt.length
    });
  }, [text, prompt]);

  // Reset copy notification
  useEffect(() => {
    if (copiedText) {
      const timer = setTimeout(() => setCopiedText(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedText]);

  const handleSummarize = async () => {
    if (!text.trim()) {
      setError({ ...error, summary: "Please enter text to summarize!" });
      return;
    }
    
    setError({ ...error, summary: "" });
    setIsLoadingSummary(true);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/summarize/`, { text });
      setSummary(response.data.summary);
      
      // Add to recent summaries
      setRecentSummaries(prev => {
        const updated = [{ original: text, summary: response.data.summary }, ...prev];
        return updated.slice(0, 5); // Keep only the 5 most recent
      });
    } catch (error) {
      console.error("Error summarizing text:", error);
      setError({
        ...error,
        summary: error.response?.data?.error || "Failed to summarize. Please try again."
      });
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const handleGenerateContent = async () => {
    if (!prompt.trim()) {
      setError({ ...error, generation: "Please enter a prompt for content generation!" });
      return;
    }
    
    setError({ ...error, generation: "" });
    setIsLoadingGeneration(true);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/generate/`, { prompt });
      setGeneratedText(response.data.generated_text);
      
      // Add to recent prompts
      setRecentPrompts(prev => {
        const updated = [{ prompt, result: response.data.generated_text }, ...prev];
        return updated.slice(0, 5); // Keep only the 5 most recent
      });
    } catch (error) {
      console.error("Error generating content:", error);
      setError({
        ...error,
        generation: error.response?.data?.error || "Failed to generate content. Please try again."
      });
    } finally {
      setIsLoadingGeneration(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
  };

  const clearFields = (section) => {
    if (section === "summary") {
      setText("");
      setSummary("");
      setError({ ...error, summary: "" });
    } else {
      setPrompt("");
      setGeneratedText("");
      setError({ ...error, generation: "" });
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`app-container ${darkMode ? "dark" : "light"}`}>
      <header className="app-header">
        <div className="logo-container">
          <Zap className="logo-icon" size={24} />
          <h1>TextGenius</h1>
        </div>
        
        <div className="header-actions">
          <button 
            onClick={toggleSidebar}
            className="history-button"
            title="View History"
          >
            <History size={20} />
            <span>History</span>
          </button>
          
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="theme-button"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      <div className="app-body">
        <main className="main-content">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === "summarize" ? "active" : ""}`}
              onClick={() => setActiveTab("summarize")}
            >
              <FileText size={18} />
              <span>Text Summarization</span>
            </button>
            <button 
              className={`tab ${activeTab === "generate" ? "active" : ""}`}
              onClick={() => setActiveTab("generate")}
            >
              <Zap size={18} />
              <span>Content Generation</span>
            </button>
          </div>

          {activeTab === "summarize" ? (
            <div className="content-panel">
              <div className="input-section">
                <div className="section-header">
                  <h2>Input Text</h2>
                  <div className="char-count">{characterCount.text} characters</div>
                </div>
                
                <div className="input-container">
                  <textarea
                    placeholder="Enter text to summarize..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className={error.summary ? "error-input" : ""}
                  />
                  {error.summary && <div className="error-message">{error.summary}</div>}
                </div>
                
                <div className="action-buttons">
                  <button 
                    onClick={handleSummarize} 
                    disabled={isLoadingSummary} 
                    className="primary-button"
                  >
                    {isLoadingSummary ? (
                      <>
                        <div className="loader"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Summarize</span>
                      </>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => clearFields("summary")} 
                    className="secondary-button"
                  >
                    <RefreshCw size={18} />
                    <span>Clear</span>
                  </button>
                </div>
              </div>
              
              <div className="result-section">
                <div className="section-header">
                  <h2>Summary</h2>
                  {summary && (
                    <button 
                      onClick={() => copyToClipboard(summary, "summary")}
                      className="copy-button"
                      title="Copy to clipboard"
                    >
                      <Copy size={16} />
                      <span>{copiedText === "summary" ? "Copied!" : "Copy"}</span>
                    </button>
                  )}
                </div>
                
                <div className={`result-container ${!summary ? "empty" : ""}`}>
                  {summary ? (
                    <div className="result-content">{summary}</div>
                  ) : (
                    <div className="empty-result">
                      <FileText size={48} className="empty-icon" />
                      <p>Your summary will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="content-panel">
              <div className="input-section">
                <div className="section-header">
                  <h2>Prompt</h2>
                  <div className="char-count">{characterCount.prompt} characters</div>
                </div>
                
                <div className="input-container">
                  <textarea
                    placeholder="Enter a prompt for content generation..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className={error.generation ? "error-input" : ""}
                  />
                  {error.generation && <div className="error-message">{error.generation}</div>}
                </div>
                
                <div className="action-buttons">
                  <button 
                    onClick={handleGenerateContent} 
                    disabled={isLoadingGeneration} 
                    className="primary-button"
                  >
                    {isLoadingGeneration ? (
                      <>
                        <div className="loader"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Zap size={18} />
                        <span>Generate Content</span>
                      </>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => clearFields("generation")} 
                    className="secondary-button"
                  >
                    <RefreshCw size={18} />
                    <span>Clear</span>
                  </button>
                </div>
              </div>
              
              <div className="result-section">
                <div className="section-header">
                  <h2>Generated Content</h2>
                  {generatedText && (
                    <button 
                      onClick={() => copyToClipboard(generatedText, "generated")}
                      className="copy-button"
                      title="Copy to clipboard"
                    >
                      <Copy size={16} />
                      <span>{copiedText === "generated" ? "Copied!" : "Copy"}</span>
                    </button>
                  )}
                </div>
                
                <div className={`result-container ${!generatedText ? "empty" : ""}`}>
                  {generatedText ? (
                    <div className="result-content">{generatedText}</div>
                  ) : (
                    <div className="empty-result">
                      <Zap size={48} className="empty-icon" />
                      <p>Your generated content will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>

        <aside className={`history-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar-header">
            <h3>
              <Clock size={20} />
              <span>History</span>
            </h3>
            <button 
              className="close-sidebar" 
              onClick={toggleSidebar}
              title="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="history-section">
            <h4>Recent Summaries</h4>
            {recentSummaries.length > 0 ? (
              <ul className="history-list">
                {recentSummaries.map((item, index) => (
                  <li 
                    key={`summary-${index}`} 
                    className="history-item"
                    onClick={() => {
                      setText(item.original);
                      setSummary(item.summary);
                      setActiveTab("summarize");
                      if (window.innerWidth < 768) setSidebarOpen(false);
                    }}
                  >
                    <FileText size={16} className="history-icon" />
                    <div className="history-content">
                      <div className="history-title">
                        {item.original.length > 40
                          ? `${item.original.substring(0, 40)}...`
                          : item.original}
                      </div>
                      <div className="history-preview">
                        {item.summary.length > 60
                          ? `${item.summary.substring(0, 60)}...`
                          : item.summary}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-state">No recent summaries</p>
            )}
          </div>
          
          <div className="history-section">
            <h4>Recent Prompts</h4>
            {recentPrompts.length > 0 ? (
              <ul className="history-list">
                {recentPrompts.map((item, index) => (
                  <li 
                    key={`prompt-${index}`} 
                    className="history-item"
                    onClick={() => {
                      setPrompt(item.prompt);
                      setGeneratedText(item.result);
                      setActiveTab("generate");
                      if (window.innerWidth < 768) setSidebarOpen(false);
                    }}
                  >
                    <Zap size={16} className="history-icon" />
                    <div className="history-content">
                      <div className="history-title">
                        {item.prompt.length > 40
                          ? `${item.prompt.substring(0, 40)}...`
                          : item.prompt}
                      </div>
                      <div className="history-preview">
                        {item.result.length > 60
                          ? `${item.result.substring(0, 60)}...`
                          : item.result}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-state">No recent prompts</p>
            )}
          </div>
        </aside>
      </div>

      <footer className="app-footer">
        <p>TextGenius © {new Date().getFullYear()} | Advanced AI Text Processing Suite</p>
      </footer>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
    </div>
  );
}

export default App;