"use client";

import * as React from "react";
import type { User, UserRole, UserStatus, PricingPackage } from "@/lib/types";
import { DEFAULT_PACKAGES } from "@/lib/constants";

// ─────────────────────────────────────────────────────────
// Keys for Local Storage Database
// ─────────────────────────────────────────────────────────
const STORAGE_KEY = "brand-estate-session";
const USERS_DB_KEY = "brand-estate-users-db";
const PACKAGES_DB_KEY = "brand-estate-packages-db";

const MOCK_PASSWORD = "Password123";

// ─────────────────────────────────────────────────────────
// Seed Users
// ─────────────────────────────────────────────────────────
const SEED_USERS: User[] = [
  {
    id: "usr-01",
    name: "Alex Johnson",
    email: "user@brandestate.com",
    role: "auth_user",
    status: "active",
    createdAt: "2026-05-10T10:00:00Z",
    savedProperties: [],
  },
  {
    id: "usr-02",
    name: "Sarah Mitchell",
    email: "agent@brandestate.com",
    role: "agent",
    status: "active",
    createdAt: "2026-04-12T09:00:00Z",
    legalDocs: {
      licenseNumber: "LIC-88291-NY",
      agencyName: "Sotheby's Realty",
      documentUrl: "license_sarah_mitchell.pdf",
      submittedAt: "2026-04-12T10:00:00Z",
    },
    savedProperties: [],
  },
  {
    id: "usr-03",
    name: "David Chen",
    email: "admin@brandestate.com",
    role: "admin",
    status: "active",
    createdAt: "2026-03-01T12:00:00Z",
    savedProperties: [],
  },
  {
    id: "usr-04",
    name: "Elena Rodriguez",
    email: "superadmin@brandestate.com",
    role: "super_admin",
    status: "active",
    createdAt: "2026-01-01T08:00:00Z",
    savedProperties: [],
  },
  {
    id: "usr-05",
    name: "Jane Doe",
    email: "jane@doe.com",
    role: "auth_user",
    status: "suspended",
    suspendedReason: "Violated community terms: repeatedly submitting fake inquiry forms.",
    createdAt: "2026-06-02T14:30:00Z",
    savedProperties: [],
  },
  {
    id: "usr-06",
    name: "Michael Chang",
    email: "michael.c@gmail.com",
    role: "auth_user",
    status: "active",
    createdAt: "2026-06-11T16:15:00Z",
    savedProperties: [],
  },
  {
    id: "usr-07",
    name: "Pending Agent",
    email: "pendingagent@brandestate.com",
    role: "agent",
    status: "pending",
    createdAt: "2026-06-15T09:00:00Z",
    legalDocs: {
      licenseNumber: "LIC-pending-12",
      agencyName: "Douglas Elliman",
      documentUrl: "agent_license_draft.pdf",
      submittedAt: "2026-06-15T10:30:00Z"
    },
    savedProperties: [],
  },
  {
    id: "usr-08",
    name: "Unsubmitted Agent",
    email: "unsubmitted@brandestate.com",
    role: "agent",
    status: "unsubmitted",
    createdAt: "2026-06-16T11:00:00Z",
    savedProperties: [],
  }
];

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
  ) => Promise<{
    success: boolean;
    error?: string;
    user?: User;
    isSuspended?: boolean;
    suspendedReason?: string;
    isUnverified?: boolean;
  }>;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => Promise<void>;
  
  // Custom Local Storage DB Helpers
  getUsers: () => User[];
  updateUserStatus: (userId: string, status: UserStatus, reason?: string) => void;
  deleteUser: (userId: string) => void;
  submitLegalDocs: (licenseNumber: string, agencyName: string, docName: string) => Promise<{ success: boolean; user: User }>;
  
  // Pricing Packages Helpers
  getPackages: () => PricingPackage[];
  updatePackage: (pkg: PricingPackage) => void;
  createPackage: (pkg: Omit<PricingPackage, "id">) => void;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

// ─────────────────────────────────────────────────────────
// Map raw API user shape → internal User interface
// ─────────────────────────────────────────────────────────
function mapApiUser(data: {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  avatar?: string;
}): User {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role as User['role'],
    status: 'active',
    avatar: data.avatar ?? '',
    isVerified: data.isVerified,
    createdAt: new Date().toISOString(),
    savedProperties: [],
  };
}

// ─────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Start null — session restored from /api/auth/me on mount
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // ── On mount: call /api/auth/me to restore session from httpOnly cookie ──
  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(mapApiUser(data.data));
        }
      } catch (e) {
        console.error('Session restore error:', e);
      } finally {
        setIsLoading(false);
      }
    })();

    // Initialize mock localStorage DBs (for admin/user-management mock features)
    try {
      if (!localStorage.getItem(USERS_DB_KEY)) {
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(SEED_USERS));
      }
      if (!localStorage.getItem(PACKAGES_DB_KEY)) {
        localStorage.setItem(PACKAGES_DB_KEY, JSON.stringify(DEFAULT_PACKAGES));
      }
    } catch (e) {
      console.error('Local DB init error:', e);
    }
  }, []);

  const persistUser = (user: User) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setCurrentUser(user);

    // Update in users database as well
    try {
      const storedUsers = localStorage.getItem(USERS_DB_KEY);
      const dbUsers: User[] = storedUsers ? JSON.parse(storedUsers) : [...SEED_USERS];
      const index = dbUsers.findIndex((u) => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
      if (index !== -1) {
        dbUsers[index] = user;
      } else {
        dbUsers.push(user);
      }
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(dbUsers));
    } catch (e) {
      console.error(e);
    }
  };

  // ─── DB Methods ───
  const getUsers = React.useCallback((): User[] => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(USERS_DB_KEY);
      return stored ? JSON.parse(stored) : SEED_USERS;
    } catch {
      return SEED_USERS;
    }
  }, []);

  const updateUserStatus = React.useCallback((userId: string, status: UserStatus, reason?: string) => {
    try {
      const stored = localStorage.getItem(USERS_DB_KEY);
      const dbUsers: User[] = stored ? JSON.parse(stored) : [...SEED_USERS];
      const index = dbUsers.findIndex((u) => u.id === userId);
      if (index !== -1) {
        dbUsers[index].status = status;
        if (status === "suspended") {
          dbUsers[index].suspendedReason = reason || "Violation of terms of service.";
        } else {
          delete dbUsers[index].suspendedReason;
        }
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(dbUsers));
        
        // If this matches the current logged-in user session, update it!
        if (currentUser && currentUser.id === userId) {
          const updated = dbUsers[index];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          setCurrentUser(updated);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  const deleteUser = React.useCallback((userId: string) => {
    try {
      const stored = localStorage.getItem(USERS_DB_KEY);
      let dbUsers: User[] = stored ? JSON.parse(stored) : [...SEED_USERS];
      dbUsers = dbUsers.filter((u) => u.id !== userId);
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(dbUsers));

      // If logging out self
      if (currentUser && currentUser.id === userId) {
        localStorage.removeItem(STORAGE_KEY);
        setCurrentUser(null);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  // ─── Packages Methods ───
  const getPackages = React.useCallback((): PricingPackage[] => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(PACKAGES_DB_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_PACKAGES;
    } catch {
      return DEFAULT_PACKAGES;
    }
  }, []);

  const updatePackage = React.useCallback((pkg: PricingPackage) => {
    try {
      const stored = localStorage.getItem(PACKAGES_DB_KEY);
      const pkgs: PricingPackage[] = stored ? JSON.parse(stored) : [...DEFAULT_PACKAGES];
      const index = pkgs.findIndex((p) => p.id === pkg.id);
      if (index !== -1) {
        pkgs[index] = pkg;
        localStorage.setItem(PACKAGES_DB_KEY, JSON.stringify(pkgs));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const createPackage = React.useCallback((pkg: Omit<PricingPackage, "id">) => {
    try {
      const stored = localStorage.getItem(PACKAGES_DB_KEY);
      const pkgs: PricingPackage[] = stored ? JSON.parse(stored) : [...DEFAULT_PACKAGES];
      const newPkg: PricingPackage = {
        ...pkg,
        id: `pkg-${Date.now()}`,
      };
      pkgs.push(newPkg);
      localStorage.setItem(PACKAGES_DB_KEY, JSON.stringify(pkgs));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // ─── Submit Legal Docs (Agent Only) ───
  const submitLegalDocs = React.useCallback(
    async (licenseNumber: string, agencyName: string, docName: string): Promise<{ success: boolean; user: User }> => {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 1000));
      if (!currentUser) throw new Error("No user logged in");

      const updatedUser: User = {
        ...currentUser,
        status: "pending",
        legalDocs: {
          licenseNumber,
          agencyName,
          documentUrl: docName,
          submittedAt: new Date().toISOString(),
        },
      };

      persistUser(updatedUser);
      setIsLoading(false);
      return { success: true, user: updatedUser };
    },
    [currentUser]
  );

  // ─── Real API Login ───
  const login = React.useCallback(
    async (
      email: string,
      password: string,
      overrideRole?: UserRole
    ): Promise<{ success: boolean; error?: string; user?: User; isSuspended?: boolean; suspendedReason?: string }> => {
      setIsLoading(true);

      // ── Demo / mock login (seed accounts or overrideRole) ──
      // The real API only has users registered via /api/auth/register.
      // Seed accounts (user@brandestate.com, agent@..., admin@...) only exist
      // in localStorage, so we fall back to the mock path for them.
      const emailLower = email.toLowerCase().trim();
      const isSeedEmail = SEED_USERS.some((u) => u.email.toLowerCase() === emailLower);

      if (isSeedEmail || overrideRole) {
        // ── Mock path (unchanged from before) ──────────────────
        await new Promise((r) => setTimeout(r, 700));

        let dbUsers: User[] = [];
        try {
          const stored = localStorage.getItem(USERS_DB_KEY);
          dbUsers = stored ? JSON.parse(stored) : [...SEED_USERS];
        } catch {
          dbUsers = [...SEED_USERS];
        }

        let user = dbUsers.find((u) => u.email.toLowerCase() === emailLower);

        if (password.length < 6) {
          setIsLoading(false);
          return { success: false, error: 'Password must be at least 6 characters.' };
        }

        const isSeed = SEED_USERS.some((u) => u.email.toLowerCase() === emailLower);
        if (isSeed && password !== MOCK_PASSWORD && !overrideRole) {
          setIsLoading(false);
          return { success: false, error: 'Invalid email or password.' };
        }

        if (user && user.status === 'suspended') {
          setIsLoading(false);
          return {
            success: false,
            error: 'Your account is suspended.',
            isSuspended: true,
            suspendedReason: user.suspendedReason || 'No reason specified.',
            user,
          };
        }

        if (!user) {
          const role = overrideRole ?? 'auth_user';
          const name = email.split('@')[0].replace(/[._]/g, ' ');
          user = {
            id: `mock-${role}-${Date.now()}`,
            name,
            email: emailLower,
            role,
            status: role === 'agent' ? 'unsubmitted' : 'active',
            createdAt: new Date().toISOString(),
            savedProperties: [],
          };
          dbUsers.push(user);
          localStorage.setItem(USERS_DB_KEY, JSON.stringify(dbUsers));
        } else if (overrideRole && user.role !== overrideRole) {
          user.role = overrideRole;
          if (overrideRole === 'agent' && user.status === 'active' && !user.legalDocs) {
            user.status = 'unsubmitted';
          }
          localStorage.setItem(USERS_DB_KEY, JSON.stringify(dbUsers));
        }

        persistUser(user);
        setIsLoading(false);
        return { success: true, user };
      }

      // ── Real API path (users registered via /api/auth/register) ──
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email: emailLower, password }),
        });
        const data = await res.json();

        if (!res.ok) {
          return {
            success: false,
            error: data.message ?? 'Login failed.',
            // Surface AccountNotVerified so the login page can show the right UI
            ...(data.error === 'AccountNotVerified' ? { isUnverified: true } : {}),
          } as { success: false; error: string; isUnverified?: boolean };
        }

        // Fetch full user state from /me (ensures role/status is always fresh)
        const meRes = await fetch('/api/auth/me', { credentials: 'include' });
        if (meRes.ok) {
          const meData = await meRes.json();
          const user = mapApiUser(meData.data);
          setCurrentUser(user);
          setIsLoading(false);
          return { success: true, user };
        }

        // Fallback: use data from login response
        const user = mapApiUser(data.data);
        setCurrentUser(user);
        setIsLoading(false);
        return { success: true, user };
      } catch {
        setIsLoading(false);
        return { success: false, error: 'Network error. Please check your connection.' };
      }
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

      const emailLower = email.toLowerCase().trim();

      // Check if user already exists
      let dbUsers: User[] = [];
      try {
        const stored = localStorage.getItem(USERS_DB_KEY);
        dbUsers = stored ? JSON.parse(stored) : [...SEED_USERS];
      } catch {
        dbUsers = [...SEED_USERS];
      }

      const exists = dbUsers.find((u) => u.email.toLowerCase() === emailLower);
      if (exists) {
        setIsLoading(false);
        return { success: false, error: "An account with this email already exists." };
      }

      const user: User = {
        id: `mock-${role}-${Date.now()}`,
        name: name.trim(),
        email: emailLower,
        role,
        status: role === "agent" ? "unsubmitted" : "active",
        createdAt: new Date().toISOString(),
        savedProperties: [],
      };

      dbUsers.push(user);
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(dbUsers));
      
      persistUser(user);
      setIsLoading(false);
      return { success: true, user };
    },
    []
  );

  const logout = React.useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {
      console.error('Logout API error:', e);
    }
    // Also clear the localStorage session for mock accounts
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
      
      // DB Helpers
      getUsers,
      updateUserStatus,
      deleteUser,
      submitLegalDocs,

      // Packages
      getPackages,
      updatePackage,
      createPackage,
    }),
    [currentUser, isLoading, login, register, logout, getUsers, updateUserStatus, deleteUser, submitLegalDocs, getPackages, updatePackage, createPackage]
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
