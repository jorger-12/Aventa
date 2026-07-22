import type {
  ButtonHTMLAttributes,
} from "react";

import styles from "./AuthButton.module.css";

interface AuthButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
}

export default function AuthButton({
  children,
  loading = false,
  loadingText = "Please wait...",
  disabled,
  type = "submit",
  ...buttonProps
}: AuthButtonProps) {
  return (
    <button
      {...buttonProps}
      type={type}
      disabled={disabled || loading}
      className={styles.button}
    >
      {loading ? loadingText : children}
    </button>
  );
}