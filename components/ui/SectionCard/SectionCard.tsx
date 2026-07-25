import type { ReactNode } from "react";

import styles from "./SectionCard.module.css";

interface SectionCardProps {
  title: string;
  children: ReactNode;
  onEdit?: () => void;
}

export default function SectionCard({
  title,
  children,
  onEdit,
}: SectionCardProps) {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>

        {onEdit && (
          <button type="button" className={styles.editButton} onClick={onEdit}>
            Edit
          </button>
        )}
      </div>

      <div className={styles.content}>{children}</div>
    </section>
  );
}
