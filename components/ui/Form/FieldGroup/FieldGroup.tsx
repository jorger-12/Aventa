import type { ReactNode } from "react";

import styles from "./FieldGroup.module.css";

interface FieldGroupProps {
  title?: string;
  description?: string;
  children: ReactNode;
}

export default function FieldGroup({
  title,
  description,
  children,
}: FieldGroupProps) {
  return (
    <section className={styles.group}>
      {(title || description) && (
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}

          {description && <p className={styles.description}>{description}</p>}
        </div>
      )}

      <div className={styles.content}>{children}</div>
    </section>
  );
}
