"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type FormEvent,
  useState,
} from "react";

import { signIn } from "@/lib/services";
import {
  AuthButton,
  AuthCard,
  AuthInput,
} from "@/components/auth";

import styles from "./LoginForm.module.css";

interface LoginFieldErrors {
  email?: string;
  password?: string;
}

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [fieldErrors, setFieldErrors] =
    useState<LoginFieldErrors>({});

  const [formError, setFormError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  function validateForm(): boolean {
    const nextErrors: LoginFieldErrors = {};

    if (!email.trim()) {
      nextErrors.email =
        "Email is required.";
    }

    if (!password) {
      nextErrors.password =
        "Password is required.";
    }

    setFieldErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setFormError("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      await signIn({
        email: email.trim(),
        password,
      });

      router.replace("/");
      router.refresh();
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to manage your account, vendors, and event planning."
      footer={
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/signup">
            Create one
          </Link>
        </p>
      }
    >
      <form
        className={styles.form}
        onSubmit={handleSubmit}
        noValidate
      >
        {formError && (
          <div
            className={styles.formError}
            role="alert"
          >
            {formError}
          </div>
        )}

        <AuthInput
          id="email"
          name="email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          error={fieldErrors.email}
          required
          onChange={(event) => {
            setEmail(event.target.value);

            if (fieldErrors.email) {
              setFieldErrors((current) => ({
                ...current,
                email: undefined,
              }));
            }
          }}
        />

        <AuthInput
          id="password"
          name="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          value={password}
          error={fieldErrors.password}
          required
          onChange={(event) => {
            setPassword(event.target.value);

            if (fieldErrors.password) {
              setFieldErrors((current) => ({
                ...current,
                password: undefined,
              }));
            }
          }}
        />

        <div className={styles.forgotPassword}>
          <Link href="/forgot-password">
            Forgot password?
          </Link>
        </div>

        <AuthButton
          loading={loading}
          loadingText="Signing in..."
        >
          Sign in
        </AuthButton>
      </form>
    </AuthCard>
  );
}