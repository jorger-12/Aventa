import { forwardRef, type TextareaHTMLAttributes } from "react";

import styles from "./Textarea.module.css";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { className = "", hasError = false, "aria-invalid": ariaInvalid, ...props },
    ref,
  ) {
    return (
      <textarea
        ref={ref}
        className={`${styles.textarea} ${className}`.trim()}
        aria-invalid={ariaInvalid ?? (hasError ? true : undefined)}
        {...props}
      />
    );
  },
);

export default Textarea;
