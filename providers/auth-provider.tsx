"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  setAccessToken,
  setRefreshToken,
  setSessionCookie,
  clearTokens,
  getRefreshToken,
} from "@/lib/auth-token";
import { authService } from "@/services/auth.service";
import type { AuthUser } from "@/types/auth";

type AuthState = {
  user: AuthUser | null;
  isLoading: boolean;
  isFetched: boolean;
};

const AuthContext = createContext<{
  user: AuthUser | null;
  isLoading: boolean;
  isFetched: boolean;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
} | null>(null);

const ORGANIZER_ROLES = ["ADMIN_ORGANIZER", "OWNER_ORGANIZER", "SUPERADMIN"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isFetched: false,
  });

  const fetchUser = useCallback(async () => {
    const hasRefresh = typeof window !== "undefined" && getRefreshToken();
    if (!hasRefresh) {
      setState((s) => ({ ...s, isLoading: false, isFetched: true }));
      return;
    }
    try {
      const res = await authService.me();
      if (res.authenticated && res.user) {
        if (res.user.role === "USER") {
          clearTokens();
          router.replace("/login?reason=restricted");
          return;
        }
        setState({
          user: res.user,
          isLoading: false,
          isFetched: true,
        });
      } else {
        setState((s) => ({ ...s, user: null, isLoading: false, isFetched: true }));
      }
    } catch {
      setState((s) => ({ ...s, user: null, isLoading: false, isFetched: true }));
    }
  }, [router]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      clearTokens();
      router.replace("/login");
    }
  }, [router]);

  const value = useMemo(
    () => ({
      user: state.user,
      isLoading: state.isLoading,
      isFetched: state.isFetched,
      logout,
      refetchUser: fetchUser,
    }),
    [state.user, state.isLoading, state.isFetched, logout, fetchUser]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function useIsOrganizer(): boolean {
  const { user } = useAuth();
  return user ? ORGANIZER_ROLES.includes(user.role) : false;
}
