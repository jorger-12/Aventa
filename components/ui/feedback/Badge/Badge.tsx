import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Badge.module.css";

type BadgeVariant = "gold" | "dark" | "light" | "success";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: BadgeVariant;
};

export default function Badge({
  children,
  variant = "gold",
  className = "",
  ...props
}: BadgeProps) {
  const badgeClassName = [
    styles.badge,
    styles[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={badgeClassName} {...props}>
      {children}
    </span>
  );
}