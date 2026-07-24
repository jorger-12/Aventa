import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

import styles from "./Checkbox.module.css";

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label: ReactNode;
  helperText?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { id, label, helperText, className = "", ...props },
  ref,
) {
  const helperTextId = helperText && id ? `${id}-helper` : undefined;

  return (
    <div className={`${styles.wrapper} ${className}`.trim()}>
      <label className={styles.label}>
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className={styles.checkbox}
          aria-describedby={helperTextId}
          {...props}
        />

        <span className={styles.control} aria-hidden="true" />

        <span className={styles.labelText}>{label}</span>
      </label>

      {helperText && (
        <p id={helperTextId} className={styles.helperText}>
          {helperText}
        </p>
      )}
    </div>
  );
});

export default Checkbox;
