import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getMe, logout as apiLogout, refreshToken } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import type { User } from "@/lib/types";

// ─── Context Shape ────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  /** Re-fetch the current user from /api/v1/auth/me */
  refresh: () => Promise<void>;
  /** Logout and clear user state */
  logout: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const me = await getMe();
      setUser(me);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        // Access token expired — try to silently refresh
        try {
          await refreshToken();
          const me = await getMe();
          setUser(me);
        } catch {
          // Both access and refresh token invalid — user is logged out
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // On mount, try to restore session from HTTP-only cookies
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    await fetchUser();
  }, [fetchUser]);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      // Even if the API call fails, clear client state
    } finally {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: user !== null,
        refresh,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
