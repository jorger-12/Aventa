import type { ReactNode } from "react";

import styles from "./LegalPage.module.css";

interface LegalPageProps {
  title: string;
  effectiveDate: string;
  children: ReactNode;
}

export default function LegalPage({
  title,
  effectiveDate,
  children,
}: LegalPageProps) {
  return (
    <main className={styles.page}>
      <article className={styles.document}>
        <header className={styles.header}>
          <p className={styles.brand}>AVENTA</p>

          <h1>{title}</h1>

          <p className={styles.effectiveDate}>
            Effective date: {effectiveDate}
          </p>
        </header>

        <div className={styles.content}>
          {children}
        </div>
      </article>
    </main>
  );
}