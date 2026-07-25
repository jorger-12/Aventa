"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { refreshCurrentUser } from "@/lib/services";
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

  const [checkingVerification, setCheckingVerification] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!authenticated || !user) {
      setCheckingVerification(false);
      setVerified(false);
      return;
    }

    let active = true;

    async function checkEmailVerification() {
      try {
        setCheckingVerification(true);

        const refreshedUser = await refreshCurrentUser();

        if (!active) {
          return;
        }

        if (!refreshedUser.emailVerified) {
          const redirect = encodeURIComponent(pathname);

          setVerified(false);
          router.replace(`/verify-email?redirect=${redirect}`);
          return;
        }

        setVerified(true);
      } catch {
        if (!active) {
          return;
        }

        setVerified(false);

        const redirect = encodeURIComponent(pathname);

        router.replace(`/verify-email?redirect=${redirect}`);
      } finally {
        if (active) {
          setCheckingVerification(false);
        }
      }
    }

    void checkEmailVerification();

    return () => {
      active = false;
    };
  }, [loading, authenticated, user?.uid, pathname, router]);

  if (loading || checkingVerification) {
    return null;
  }

  if (!authenticated || !user || !verified) {
    return null;
  }

  return <>{children}</>;
}
