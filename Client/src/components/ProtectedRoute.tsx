import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Where to redirect if not authenticated. Defaults to / */
  redirectTo?: string;
  /** Optional role required to access this route. If not met, redirected to fallback */
  requiredRole?: "ADMIN" | "CREATOR";
  /** Fallback URL if role check fails. Defaults to /dashboard */
  roleFallback?: string;
}

/**
 * Wraps any page content that requires authentication or specific roles.
 * Shows a loading spinner while auth state is resolving,
 * then enforces authentication and role-based access control.
 */
export function ProtectedRoute({
  children,
  redirectTo = "/",
  requiredRole,
  roleFallback = "/dashboard",
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate(redirectTo, { replace: true });
      } else if (requiredRole && user?.role !== requiredRole) {
        navigate(roleFallback, { replace: true });
      }
    }
  }, [isLoading, isAuthenticated, user, requiredRole, redirectTo, roleFallback, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-nu-bg dark:bg-[#0C0614] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-nu-purple/20 border-t-nu-purple animate-spin" />
          <p className="text-sm font-medium text-nu-muted dark:text-gray-400">Loading…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
