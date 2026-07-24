import type { ReactNode } from "react";

import styles from "./FormMessage.module.css";

export interface FormMessageProps {
  children: ReactNode;
  type?: "helper" | "error" | "success" | "warning";
  id?: string;
}

export default function FormMessage({
  children,
  type = "helper",
  id,
}: FormMessageProps) {
  return (
    <p
      id={id}
      className={`${styles.message} ${styles[type]}`}
      role={type === "error" ? "alert" : undefined}
      aria-live={type === "error" ? "assertive" : "polite"}
    >
      {children}
    </p>
  );
}
