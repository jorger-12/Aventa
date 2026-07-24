import { forwardRef, type InputHTMLAttributes } from "react";

import styles from "./Input.module.css";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className = "", hasError = false, "aria-invalid": ariaInvalid, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={`${styles.input} ${className}`.trim()}
      aria-invalid={ariaInvalid ?? (hasError ? true : undefined)}
      {...props}
    />
  );
});

export default Input;
