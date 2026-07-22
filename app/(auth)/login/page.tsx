import Link from "next/link";

import { AuthCard } from "@/components/auth";

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to manage your account, vendors, and event planning."
      footer={
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/signup">
            Create one
          </Link>
        </p>
      }
    >
      <p>Login form coming next.</p>
    </AuthCard>
  );
}