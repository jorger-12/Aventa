import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Container.module.css";

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export default function Container({
  children,
  className = "",
  ...props
}: ContainerProps) {
  const containerClassName = [styles.container, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClassName} {...props}>
      {children}
    </div>
  );
}