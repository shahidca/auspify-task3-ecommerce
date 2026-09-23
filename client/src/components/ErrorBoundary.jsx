import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to console (you could send to Sentry here)
    console.error('🛑 ErrorBoundary caught:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="error-page">
        <div className="error-orb error-orb-1" aria-hidden="true" />
        <div className="error-orb error-orb-2" aria-hidden="true" />

        <div className="error-page-content">
          <div className="error-icon">
            <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>

          <span className="error-code">500</span>
          <h1 className="error-title">Something went wrong</h1>
          <p className="error-message">
            An unexpected error occurred. We've logged it and our team will look into it.
          </p>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="error-details">
              <summary>Show error details (dev only)</summary>
              <pre>{this.state.error.toString()}</pre>
              {this.state.errorInfo && (
                <pre>{this.state.errorInfo.componentStack}</pre>
              )}
            </details>
          )}

          <div className="error-actions">
            <button className="btn btn-primary" onClick={this.handleReload}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
              Try Again
            </button>
            <button className="btn btn-outline" onClick={this.handleGoHome}>
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }
}