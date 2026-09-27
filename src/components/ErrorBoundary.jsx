import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          background: '#fef2f2',
          border: '1.5px solid #fecaca',
          borderRadius: 'var(--radius-lg, 12px)',
          padding: '2rem',
          textAlign: 'center',
          color: '#991b1b',
          margin: '1.5rem 0',
          boxShadow: '0 4px 12px rgba(220, 38, 38, 0.08)'
        }}>
          <AlertTriangle size={36} color="#dc2626" style={{ margin: '0 auto 0.75rem auto' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#7f1d1d', marginBottom: '0.5rem' }}>
            {this.props.fallbackTitle || 'Component Recovered Gracefully'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#991b1b', maxWidth: '500px', margin: '0 auto 1.25rem auto' }}>
            {this.state.error?.message || 'A temporary visual rendering interruption occurred. You can restore this view immediately.'}
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#dc2626',
              color: '#ffffff',
              border: 'none',
              padding: '0.6rem 1.2rem',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={15} />
            <span>Reload Component</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
