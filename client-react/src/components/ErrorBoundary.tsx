import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(_error: Error, _errorInfo: any) {
    // Можно логировать ошибку
    // console.error('ErrorBoundary caught:', _error, _errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div style={{ color: 'red', padding: 16 }}>
        <h2>Что-то пошло не так 😢</h2>
        <pre>{this.state.error?.message}</pre>
      </div>;
    }
    return this.props.children;
  }
} 