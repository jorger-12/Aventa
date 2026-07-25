import Link from "next/link";

interface VendorSuccessPageProps {
  searchParams: Promise<{
    vendor?: string;
  }>;
}

export default async function VendorSuccessPage({
  searchParams,
}: VendorSuccessPageProps) {
  const { vendor } = await searchParams;

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background: "#f7f5ef",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "620px",
          padding: "48px 32px",
          background: "#ffffff",
          border: "1px solid #e7e1d7",
          borderRadius: "20px",
          textAlign: "center",
          boxShadow: "0 18px 45px rgba(0, 0, 0, 0.08)",
        }}
      >
        <p
          style={{
            margin: "0 0 12px",
            color: "#9a7536",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Profile created
        </p>

        <h1
          style={{
            margin: "0 0 16px",
            fontSize: "clamp(2rem, 6vw, 3rem)",
          }}
        >
          Your business was submitted
        </h1>

        <p
          style={{
            margin: "0 auto 32px",
            maxWidth: "480px",
            color: "#666",
            lineHeight: 1.7,
          }}
        >
          Your vendor profile has been saved. We will connect the uploaded
          images and dashboard management next.
        </p>

        {vendor ? (
          <p
            style={{
              marginBottom: "28px",
              color: "#777",
              fontSize: "0.9rem",
              overflowWrap: "anywhere",
            }}
          >
            Vendor ID: {vendor}
          </p>
        ) : null}

        <Link
          href="/vendor-dashboard"
          style={{
            display: "inline-flex",
            minHeight: "48px",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 24px",
            background: "#111",
            color: "#fff",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Go to dashboard
        </Link>
      </section>
    </main>
  );
}
