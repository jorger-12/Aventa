import { forwardRef, type SelectHTMLAttributes } from "react";

import styles from "./Select.module.css";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className = "", hasError = false, "aria-invalid": ariaInvalid, ...props },
  ref,
) {
  return (
    <select
      ref={ref}
      className={`${styles.select} ${className}`.trim()}
      aria-invalid={ariaInvalid ?? (hasError ? true : undefined)}
      {...props}
    />
  );
});

export default Select;
