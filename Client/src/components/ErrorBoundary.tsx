import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, RefreshCw } from "lucide-react";

// ─── Error Boundary ───────────────────────────────────────────────────────────

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // In production you'd send this to Sentry / LogRocket / etc.
    console.error("[ErrorBoundary caught an error]", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen bg-nu-bg flex flex-col items-center justify-center p-6 gap-6">
          {/* Icon */}
          <div className="w-20 h-20 rounded-3xl bg-red-50 border border-red-100 flex items-center justify-center shadow-sm">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>

          {/* Text */}
          <div className="text-center max-w-sm flex flex-col gap-2">
            <h1 className="text-2xl font-extrabold text-nu-charcoal tracking-tight">
              Something went wrong
            </h1>
            <p className="text-sm text-nu-muted leading-relaxed">
              An unexpected error occurred. This has been logged and we&apos;ll
              look into it.
            </p>
            {this.state.error?.message && (
              <p className="text-xs font-mono text-red-500 bg-red-50 border border-red-100 rounded-xl px-3 py-2 mt-1 text-left break-all">
                {this.state.error.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 bg-nu-purple hover:bg-nu-purple-hover text-white font-semibold rounded-full px-6 py-2.5 text-sm transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Page
            </button>
            <Link
              to="/"
              className="border-2 border-gray-200 text-nu-muted font-semibold rounded-full px-6 py-2.5 text-sm hover:border-gray-300 hover:text-nu-charcoal transition-all"
            >
              Go Home
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
