"use client";

import * as React from "react";
import type { User, UserRole } from "@/lib/types";

// ─────────────────────────────────────────────────────────
// Mock credentials — maps email → role for instant demo login
// ─────────────────────────────────────────────────────────
const MOCK_CREDENTIALS: Record<string, { role: UserRole; name: string }> = {
  "user@brandestate.com": { role: "auth_user", name: "Alex Johnson" },
  "agent@brandestate.com": { role: "agent", name: "Sarah Mitchell" },
  "admin@brandestate.com": { role: "admin", name: "David Chen" },
  "superadmin@brandestate.com": { role: "super_admin", name: "Elena Rodriguez" },
};

const MOCK_PASSWORD = "Password123";
const STORAGE_KEY = "brand-estate-session";

function buildMockUser(
  email: string,
  name: string,
  role: UserRole
): User {
  return {
    id: `mock-${role}-${Date.now()}`,
    name,
    email,
    role,
    avatar: undefined,
    savedProperties: [],
    createdAt: new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────────────────
// Role → dashboard redirect map
// ─────────────────────────────────────────────────────────
export function getDashboardRoute(role: UserRole): string {
  switch (role) {
    case "agent":
      return "/agent/dashboard";
    case "admin":
      return "/admin/dashboard";
    case "super_admin":
      return "/super-admin/dashboard";
    default:
      return "/dashboard";
  }
}

// ─────────────────────────────────────────────────────────
// Context type
// ─────────────────────────────────────────────────────────
interface AuthContextValue {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    overrideRole?: UserRole
  ) => Promise<{ success: boolean; error?: string; user?: User }>;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

// ─────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  // Rehydrate session from localStorage on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCurrentUser(JSON.parse(stored) as User);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const persistUser = (user: User) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setCurrentUser(user);
  };

  const login = React.useCallback(
    async (
      email: string,
      password: string,
      overrideRole?: UserRole
    ): Promise<{ success: boolean; error?: string; user?: User }> => {
      setIsLoading(true);

      // Simulate network latency
      await new Promise((r) => setTimeout(r, 700));

      const emailLower = email.toLowerCase().trim();
      const mock = MOCK_CREDENTIALS[emailLower];

      // Accept any email/password combo — only enforce password for known accounts
      if (password.length < 6) {
        setIsLoading(false);
        return { success: false, error: "Password must be at least 6 characters." };
      }

      if (mock && password !== MOCK_PASSWORD && !overrideRole) {
        // Correct known credential check
        setIsLoading(false);
        return { success: false, error: "Invalid email or password." };
      }

      const role = overrideRole ?? mock?.role ?? "auth_user";
      const name = mock?.name ?? email.split("@")[0].replace(/[._]/g, " ");
      const user = buildMockUser(emailLower, name, role);
      persistUser(user);
      setIsLoading(false);
      return { success: true, user };
    },
    []
  );

  const register = React.useCallback(
    async (
      name: string,
      email: string,
      password: string,
      role: UserRole
    ): Promise<{ success: boolean; error?: string; user?: User }> => {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 800));

      if (!name.trim()) {
        setIsLoading(false);
        return { success: false, error: "Full name is required." };
      }
      if (password.length < 6) {
        setIsLoading(false);
        return { success: false, error: "Password must be at least 6 characters." };
      }

      const user = buildMockUser(email.toLowerCase().trim(), name.trim(), role);
      persistUser(user);
      setIsLoading(false);
      return { success: true, user };
    },
    []
  );

  const logout = React.useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentUser(null);
  }, []);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      currentUser,
      isAuthenticated: !!currentUser,
      isLoading,
      login,
      register,
      logout,
    }),
    [currentUser, isLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
