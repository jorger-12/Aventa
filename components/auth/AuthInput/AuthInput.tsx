import {
  forwardRef,
  type InputHTMLAttributes,
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
    ...inputProps
  },
  ref,
) {
  const inputId =
    id ?? inputProps.name ?? undefined;

  const errorId = inputId
    ? `${inputId}-error`
    : undefined;

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

      <input
        {...inputProps}
        ref={ref}
        id={inputId}
        required={required}
        className={`${styles.input} ${
          error ? styles.inputError : ""
        }`}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? errorId : undefined
        }
      />

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