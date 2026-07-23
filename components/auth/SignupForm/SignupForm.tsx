"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { AuthButton, AuthCard, AuthInput } from "@/components/auth";
import { signUp } from "@/lib/services";

import styles from "./SignupForm.module.css";

type AccountType = "customer" | "vendor";

interface SignupFieldErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  legalAccepted?: string;
}

export default function SignupForm() {
  const router = useRouter();

  const [accountType, setAccountType] = useState<AccountType>("customer");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [legalAccepted, setLegalAccepted] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<SignupFieldErrors>({});

  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  function validateForm(): boolean {
    const nextErrors: SignupFieldErrors = {};

    if (!firstName.trim()) {
      nextErrors.firstName = "First name is required.";
    }

    if (!lastName.trim()) {
      nextErrors.lastName = "Last name is required.";
    }

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (!legalAccepted) {
      nextErrors.legalAccepted =
        "You must accept the Terms, Privacy Policy, and Platform Disclaimer.";
    }

    setFieldErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setFormError("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      await signUp({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        legalAccepted,
        role: accountType,
      });

      router.replace("/verify-email");
      router.refresh();
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to create your account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function clearFieldError(field: keyof SignupFieldErrors) {
    if (!fieldErrors[field]) {
      return;
    }

    setFieldErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  return (
    <AuthCard
      title="Create your account"
      description="Join Aventa to discover vendors, save favorites, and manage your business."
      footer={
        <p>
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      }
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {formError && (
          <div className={styles.formError} role="alert">
            {formError}
          </div>
        )}

        <div
          className={styles.accountTypeTabs}
          role="group"
          aria-label="Account type"
        >
          <button
            type="button"
            className={
              accountType === "customer"
                ? styles.activeAccountTab
                : styles.accountTab
            }
            aria-pressed={accountType === "customer"}
            onClick={() => setAccountType("customer")}
          >
            Customer
          </button>

          <button
            type="button"
            className={
              accountType === "vendor"
                ? styles.activeAccountTab
                : styles.accountTab
            }
            aria-pressed={accountType === "vendor"}
            onClick={() => setAccountType("vendor")}
          >
            Business
          </button>
        </div>

        <div className={styles.nameGrid}>
          <AuthInput
            id="firstName"
            name="firstName"
            label="First name"
            type="text"
            autoComplete="given-name"
            value={firstName}
            error={fieldErrors.firstName}
            required
            onChange={(event) => {
              setFirstName(event.target.value);
              clearFieldError("firstName");
            }}
          />

          <AuthInput
            id="lastName"
            name="lastName"
            label="Last name"
            type="text"
            autoComplete="family-name"
            value={lastName}
            error={fieldErrors.lastName}
            required
            onChange={(event) => {
              setLastName(event.target.value);
              clearFieldError("lastName");
            }}
          />
        </div>

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
            clearFieldError("email");
          }}
        />

        <AuthInput
          id="password"
          name="password"
          label="Password"
          type="password"
          placeholder="Create a password"
          autoComplete="new-password"
          value={password}
          error={fieldErrors.password}
          required
          onChange={(event) => {
            setPassword(event.target.value);
            clearFieldError("password");
          }}
        />

        <AuthInput
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm password"
          type="password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          value={confirmPassword}
          error={fieldErrors.confirmPassword}
          required
          onChange={(event) => {
            setConfirmPassword(event.target.value);
            clearFieldError("confirmPassword");
          }}
        />

        <p className={styles.passwordHint}>
          Use at least 8 characters with an uppercase letter, lowercase letter,
          and number.
        </p>

        <div className={styles.legalSection}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={legalAccepted}
              aria-invalid={Boolean(fieldErrors.legalAccepted)}
              aria-describedby={
                fieldErrors.legalAccepted ? "legalAccepted-error" : undefined
              }
              onChange={(event) => {
                setLegalAccepted(event.target.checked);
                clearFieldError("legalAccepted");
              }}
            />

            <span>
              I agree to the{" "}
              <Link href="/terms" target="_blank">
                Terms of Service
              </Link>
              ,{" "}
              <Link href="/privacy" target="_blank">
                Privacy Policy
              </Link>
              , and{" "}
              <Link href="/disclaimer" target="_blank">
                Platform Disclaimer
              </Link>
              .
            </span>
          </label>

          {fieldErrors.legalAccepted && (
            <p
              id="legalAccepted-error"
              className={styles.legalError}
              role="alert"
            >
              {fieldErrors.legalAccepted}
            </p>
          )}
        </div>

        <AuthButton
          loading={loading}
          loadingText="Creating account..."
          disabled={loading || !legalAccepted}
        >
          Create account
        </AuthButton>
      </form>
    </AuthCard>
  );
}
