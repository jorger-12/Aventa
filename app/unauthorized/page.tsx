import Link from "next/link";

export default function UnauthorizedPage() {
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
      <div
        style={{
          maxWidth: "480px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
      >
        <h1>Access Denied</h1>

        <p>You do not have permission to access this page.</p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <Link href="/">Return Home</Link>

          <Link href="/login">Sign In</Link>
        </div>
      </div>
    </main>
  );
}
