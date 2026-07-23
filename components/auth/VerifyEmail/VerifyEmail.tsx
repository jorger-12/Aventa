"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { getCurrentAuthUser } from "@/lib/auth";
import {
  refreshCurrentUser,
  resendVerificationEmail,
  signOut,
} from "@/lib/services";

import { AuthButton, AuthCard } from "@/components/auth";

import styles from "./VerifyEmail.module.css";

const RESEND_COOLDOWN_SECONDS = 60;
const VERIFICATION_CHECK_INTERVAL = 5000;

export default function VerifyEmail() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const checkVerification = useCallback(
    async (showUnverifiedMessage = false) => {
      try {
        setErrorMessage("");

        const refreshedUser = await refreshCurrentUser();

        if (refreshedUser.email) {
          setEmail(refreshedUser.email);
        }

        if (refreshedUser.emailVerified) {
          router.replace("/");
          router.refresh();

          return true;
        }

        if (showUnverifiedMessage) {
          setErrorMessage(
            "Your email has not been verified yet. Open the verification email and try again.",
          );
        }

        return false;
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to check your verification status.",
        );

        return false;
      }
    },
    [router],
  );

  useEffect(() => {
    const currentUser = getCurrentAuthUser();

    if (!currentUser) {
      router.replace("/login");
      return;
    }

    setEmail(currentUser.email ?? "");

    if (currentUser.emailVerified) {
      router.replace("/");
      return;
    }

    const intervalId = window.setInterval(() => {
      void checkVerification(false);
    }, VERIFICATION_CHECK_INTERVAL);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [checkVerification, router]);

  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCooldown((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [cooldown]);

  async function handleContinue() {
    try {
      setChecking(true);
      setSuccessMessage("");

      await checkVerification(true);
    } finally {
      setChecking(false);
    }
  }

  async function handleResend() {
    if (resending || cooldown > 0) {
      return;
    }

    try {
      setResending(true);
      setErrorMessage("");
      setSuccessMessage("");

      await resendVerificationEmail();

      setSuccessMessage("A new verification email has been sent.");

      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to resend the verification email.",
      );
    } finally {
      setResending(false);
    }
  }

  async function handleUseDifferentAccount() {
    try {
      await signOut();

      router.replace("/login");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to sign out.",
      );
    }
  }

  return (
    <AuthCard
      title="Verify your email"
      description="Confirm your email address to finish setting up your Aventa account."
      footer={
        <p>
          Entered the wrong email?{" "}
          <button
            type="button"
            className={styles.footerButton}
            onClick={handleUseDifferentAccount}
          >
            Use another account
          </button>
        </p>
      }
    >
      <div className={styles.container}>
        <div className={styles.iconWrapper} aria-hidden="true">
          <svg viewBox="0 0 24 24" className={styles.icon}>
            <path
              d="M4 6.5h16v11H4z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />

            <path
              d="m4.5 7 7.5 6 7.5-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className={styles.emailSection}>
          <p className={styles.instructions}>We sent a verification link to:</p>

          <p className={styles.email}>{email || "your email address"}</p>

          <p className={styles.helpText}>
            Open the email and select the verification link. This page will
            check your status automatically.
          </p>
        </div>

        {successMessage && (
          <div className={styles.successMessage} role="status">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className={styles.errorMessage} role="alert">
            {errorMessage}
          </div>
        )}

        <div className={styles.actions}>
          <AuthButton
            loading={checking}
            loadingText="Checking..."
            onClick={handleContinue}
          >
            I&apos;ve verified my email
          </AuthButton>

          <button
            type="button"
            className={styles.resendButton}
            disabled={resending || cooldown > 0}
            onClick={handleResend}
          >
            {resending
              ? "Sending..."
              : cooldown > 0
                ? `Resend available in ${cooldown}s`
                : "Resend verification email"}
          </button>
        </div>

        <p className={styles.spamNotice}>
          Didn&apos;t receive it? Check your spam or promotions folder.
        </p>

        <Link href="/" className={styles.homeLink}>
          Return to Aventa
        </Link>
      </div>
    </AuthCard>
  );
}
