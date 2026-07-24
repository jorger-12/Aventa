import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Section.module.css";

type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

export default function Section({
  children,
  className = "",
  ...props
}: SectionProps) {
  const sectionClassName = [styles.section, className]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={sectionClassName} {...props}>
      {children}
    </section>
  );
}