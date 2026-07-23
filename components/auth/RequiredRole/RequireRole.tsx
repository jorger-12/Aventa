"use client";

import { useEffect, type ReactNode } from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/hooks";

import type { UserRole } from "@/types";

interface RequireRoleProps {
  children: ReactNode;
  allowedRoles: readonly UserRole[];
}

export default function RequireRole({
  children,
  allowedRoles,
}: RequireRoleProps) {
  const router = useRouter();

  const { profile, loading, authenticated } = useAuth();

  const hasRequiredRole =
    profile !== null && allowedRoles.includes(profile.role);

  useEffect(() => {
    if (loading || !authenticated) {
      return;
    }

    if (!profile) {
      return;
    }

    if (!allowedRoles.includes(profile.role)) {
      router.replace("/unauthorized");
    }
  }, [profile, loading, authenticated, allowedRoles, router]);

  if (loading) {
    return null;
  }

  if (!authenticated || !profile) {
    return null;
  }

  if (!hasRequiredRole) {
    return null;
  }

  return <>{children}</>;
}
