"use client";

import { useEffect, type ReactNode } from "react";

import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/lib/hooks";

interface RequireVerifiedEmailProps {
  children: ReactNode;
}

export default function RequireVerifiedEmail({
  children,
}: RequireVerifiedEmailProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, loading, authenticated } = useAuth();

  useEffect(() => {
    if (loading || !authenticated || !user) {
      return;
    }

    if (!user.emailVerified) {
      const redirect = encodeURIComponent(pathname);

      router.replace(`/verify-email?redirect=${redirect}`);
    }
  }, [user, loading, authenticated, pathname, router]);

  if (loading) {
    return null;
  }

  if (!authenticated || !user) {
    return null;
  }

  if (!user.emailVerified) {
    return null;
  }

  return <>{children}</>;
}
