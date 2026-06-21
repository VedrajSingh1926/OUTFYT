import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCcw } from 'lucide-react';
import { Logo } from './Logo';

interface Props {
  children: ReactNode;
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

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAFAFC] flex flex-col items-center justify-center p-6 text-center">
          <div className="mb-12">
            <Logo size="md" />
          </div>
          
          <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl shadow-[#7C6CFF]/5 border border-[#7C6CFF]/10">
            <div className="w-16 h-16 mx-auto bg-[#FF6B81]/10 rounded-full flex items-center justify-center mb-6">
               <ShieldAlert className="w-8 h-8 text-[#FF6B81]" />
            </div>
            
            <h1 className="text-2xl font-bold mb-3 text-foreground" style={{ fontFamily: 'var(--font-poppins)' }}>
              Oops, something went wrong.
            </h1>
            
            <p className="text-foreground/60 mb-8" style={{ fontFamily: 'var(--font-poppins)' }}>
              StyleSync encountered an unexpected error. Please refresh the page or try again later.
            </p>

            <button
              onClick={this.handleReset}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#7C6CFF] to-[#FF6B81] text-white font-semibold hover:shadow-lg hover:shadow-[#7C6CFF]/20 transition-all flex items-center justify-center gap-2"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              <RefreshCcw className="w-5 h-5" />
              Refresh Application
            </button>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-8 text-left bg-red-50 p-4 rounded-xl overflow-auto text-xs text-red-900 border border-red-100">
                <p className="font-bold mb-1">{this.state.error.name}: {this.state.error.message}</p>
                <pre>{this.state.error.stack}</pre>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
