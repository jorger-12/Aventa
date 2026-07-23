"use client";

import {
  forwardRef,
  type InputHTMLAttributes,
  useState,
} from "react";

import styles from "./AuthInput.module.css";

interface AuthInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const AuthInput = forwardRef<
  HTMLInputElement,
  AuthInputProps
>(function AuthInput(
  {
    label,
    error,
    id,
    required,
    type = "text",
    ...inputProps
  },
  ref,
) {
  const [passwordVisible, setPasswordVisible] =
    useState(false);

  const inputId =
    id ?? inputProps.name ?? undefined;

  const errorId = inputId
    ? `${inputId}-error`
    : undefined;

  const isPassword = type === "password";

  const resolvedType = isPassword
    ? passwordVisible
      ? "text"
      : "password"
    : type;

  return (
    <div className={styles.field}>
      <label
        className={styles.label}
        htmlFor={inputId}
      >
        {label}

        {required && (
          <span
            className={styles.required}
            aria-hidden="true"
          >
            *
          </span>
        )}
      </label>

      <div className={styles.inputWrapper}>
        <input
          {...inputProps}
          ref={ref}
          id={inputId}
          type={resolvedType}
          required={required}
          className={`${styles.input} ${
            isPassword
              ? styles.passwordInput
              : ""
          } ${
            error ? styles.inputError : ""
          }`}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? errorId : undefined
          }
        />

        {isPassword && (
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => {
              setPasswordVisible(
                (current) => !current,
              );
            }}
            aria-label={
              passwordVisible
                ? "Hide password"
                : "Show password"
            }
            aria-pressed={passwordVisible}
          >
            {passwordVisible ? "Hide" : "Show"}
          </button>
        )}
      </div>

      {error && (
        <p
          id={errorId}
          className={styles.error}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
});

export default AuthInput;