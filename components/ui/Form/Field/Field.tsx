import type { ReactNode } from "react";

import styles from "./Field.module.css";

interface FieldProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
  helperText?: string;
  error?: string;
}

export default function Field({
  label,
  htmlFor,
  children,
  required = false,
  helperText,
  error,
}: FieldProps) {
  const messageId = `${htmlFor}-message`;

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={htmlFor}>
        {label}

        {required && (
          <>
            <span className={styles.required} aria-hidden="true">
              *
            </span>

            <span className={styles.srOnly}>required</span>
          </>
        )}
      </label>

      {children}

      {error ? (
        <p id={messageId} className={styles.error} role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p id={messageId} className={styles.helperText}>
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
