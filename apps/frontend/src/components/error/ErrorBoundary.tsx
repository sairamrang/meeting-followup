import { Component, ErrorInfo, ReactNode } from 'react';
import { Link, Outlet } from 'react-router-dom';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h1 className="text-2xl font-bold text-red-900 mb-2">
                Something went wrong
              </h1>
              <p className="text-red-700 mb-4">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <Link
                to="/"
                className="inline-block btn-primary"
                onClick={() => this.setState({ hasError: false, error: null })}
              >
                Go back home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children || <Outlet />;
  }
}
