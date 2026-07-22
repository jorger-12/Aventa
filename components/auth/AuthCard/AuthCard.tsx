import type { ReactNode } from "react";

import styles from "./AuthCard.module.css";

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function AuthCard({
  title,
  description,
  children,
  footer,
}: AuthCardProps) {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <p className={styles.brand}>AVENTA</p>
        <h1>{title}</h1>

        {description && (
          <p className={styles.description}>
            {description}
          </p>
        )}
      </div>

      <div className={styles.content}>
        {children}
      </div>

      {footer && (
        <div className={styles.footer}>
          {footer}
        </div>
      )}
    </section>
  );
}