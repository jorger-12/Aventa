import type { ReactNode } from "react";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
        background: "#f7f5ef",
      }}
    >
      {children}
    </main>
  );
}