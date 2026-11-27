import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#090909] px-6 text-center text-[#F3EEE6]">
          <p className="font-serif text-2xl tracking-[0.22em] text-[#EAD5AD]">LUMIÈRE</p>
          <h1 className="mt-6 font-serif text-3xl font-normal">
            We encountered an unexpected interruption.
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[#AAA39A]">
            Please refresh the page to restore the studio experience.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-8 inline-flex min-h-[46px] cursor-pointer items-center justify-center border border-[#C9A875] px-7 py-3 text-xs font-medium tracking-[0.2em] text-[#EAD5AD] uppercase transition-colors hover:bg-[#C9A875] hover:text-[#090909]"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
