import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Where to redirect if not authenticated. Defaults to /login */
  redirectTo?: string;
}

/**
 * Wraps any page content that requires authentication.
 * Shows a loading spinner while the auth state is resolving,
 * then either renders children or redirects to /login.
 */
export function ProtectedRoute({
  children,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isLoading, isAuthenticated, redirectTo, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-nu-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          {/* Spinner using existing nu-purple token */}
          <div className="w-12 h-12 rounded-full border-4 border-nu-purple/20 border-t-nu-purple animate-spin" />
          <p className="text-sm font-medium text-nu-muted">Loading…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect is in progress — render nothing to avoid flash
    return null;
  }

  return <>{children}</>;
}
