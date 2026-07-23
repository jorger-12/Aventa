"use client";

import { useEffect, type ReactNode } from "react";

import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/lib/hooks";

interface RequireAuthProps {
  children: ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { loading, authenticated } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!authenticated) {
      const redirect = encodeURIComponent(pathname);

      router.replace(`/login?redirect=${redirect}`);
    }
  }, [loading, authenticated, pathname, router]);

  if (loading) {
    return null;
  }

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
}
