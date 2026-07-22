"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  subscribeToAuthState,
  type AuthUser,
} from "@/lib/auth";

import { getUserById } from "@/lib/repositories";
import { signOut } from "@/lib/services";

import type { UserProfile } from "@/types";

interface AuthContextValue {
  user: AuthUser | null;
  profile: UserProfile | null;

  loading: boolean;
  authenticated: boolean;

  refreshProfile: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined,
  );

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(
      async (authUser) => {
        setLoading(true);
        setUser(authUser);

        if (!authUser) {
          setProfile(null);
          setLoading(false);
          return;
        }

        try {
          const userProfile = await getUserById(
            authUser.uid,
          );

          setProfile(userProfile);
        } catch (error) {
          console.error(
            "Unable to load the authenticated user profile:",
            error,
          );

          setProfile(null);
        } finally {
          setLoading(false);
        }
      },
    );

    return unsubscribe;
  }, []);

  async function refreshProfile(): Promise<void> {
    if (!user) {
      setProfile(null);
      return;
    }

    const refreshedProfile =
      await getUserById(user.uid);

    setProfile(refreshedProfile);
  }

  async function logout(): Promise<void> {
    await signOut();

    setUser(null);
    setProfile(null);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,

      loading,
      authenticated: Boolean(user),

      refreshProfile,
      logout,
    }),
    [user, profile, loading],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider.",
    );
  }

  return context;
}