import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // We'll create this CSS file

function App() {
  const [longUrl, setLongUrl] = useState('');
  const [shortKey, setShortKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const API_BASE = 'https://gn5i464b10.execute-api.ap-south-1.amazonaws.com';

  const handleShorten = async () => {
    if (!longUrl.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(
        `${API_BASE}/shorten`,
        longUrl.trim(),
        {
          headers: {
            'Content-Type': 'text/plain'
          }
        }
      );
      
      setShortKey(response.data);
      
    } catch (error) {
      console.error('Shorten Error:', error);
      if (error.response) {
        setError(`Failed to shorten URL: ${error.response.status} ${error.response.statusText}`);
      } else {
        setError('Failed to shorten URL: Network error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTestRedirect = () => {
    if (shortKey) {
      window.open(`${API_BASE}/${shortKey}`, '_blank');
    }
  };

  const copyToClipboard = async () => {
    const shortUrl = `${API_BASE}/${shortKey}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const resetForm = () => {
    setLongUrl('');
    setShortKey('');
    setError('');
    setCopied(false);
  };

  return (
    <div className="app-container">
      {/* Background Elements */}
      <div className="bg-circles">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      <div className="content-wrapper">
        {/* Header */}
        <header className="header">
          <div className="logo">
            <div className="logo-icon">🔗</div>
            <h1 className="logo-text">
              <span className="gradient-text">URL</span>
              <span className="accent-text">Shortener</span>
            </h1>
          </div>
          <p className="subtitle">Transform your long URLs into powerful short links</p>
        </header>

        {/* Main Form */}
        <div className="form-container">
          <div className="input-group">
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="🌐 Enter your long URL here..."
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                className={`url-input ${error ? 'error' : ''}`}
                onKeyPress={(e) => e.key === 'Enter' && handleShorten()}
                disabled={loading}
              />
              {longUrl && (
                <button 
                  className="clear-btn"
                  onClick={resetForm}
                  type="button"
                >
                  ✕
                </button>
              )}
            </div>
            
            <button 
              onClick={handleShorten}
              disabled={loading || !longUrl.trim()}
              className={`shorten-btn ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  <span>✨ Shorten</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
        </div>

        {/* Result Section */}
        {shortKey && (
          <div className="result-container">
            <div className="result-header">
              <div className="success-icon">✅</div>
              <h3>Your short link is ready!</h3>
            </div>
            
            <div className="url-result">
              <div className="short-url-display">
                <span className="url-text">{`${API_BASE}/${shortKey}`}</span>
              </div>
              
              <div className="action-buttons">
                <button 
                  onClick={copyToClipboard}
                  className={`action-btn copy-btn ${copied ? 'copied' : ''}`}
                >
                  {copied ? (
                    <>
                      <span className="btn-icon">✓</span>
                      Copied!
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">📋</span>
                      Copy Link
                    </>
                  )}
                </button>
                
                <button 
                  onClick={handleTestRedirect}
                  className="action-btn test-btn"
                >
                  <span className="btn-icon">🚀</span>
                  Test Link
                </button>
              </div>
            </div>

            <div className="stats">
              <div className="stat-item">
                <span className="stat-value">{shortKey}</span>
                <span className="stat-label">Short Key</span>
              </div>
            </div>
          </div>
        )}

        {/* How to Use Section */}
        <div className="instructions">
          <h4>🚀 How it works</h4>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h5>Paste URL</h5>
                <p>Enter your long URL in the input field above</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h5>Generate</h5>
                <p>Click the shorten button to create your short link</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h5>Share</h5>
                <p>Copy and share your new short URL anywhere</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="footer">
          <p>Made with ❤️ for better link sharing</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
