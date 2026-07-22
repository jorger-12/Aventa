import Link from "next/link";

import { AuthCard } from "@/components/auth";

export default function SignupPage() {
  return (
    <AuthCard
      title="Create your account"
      description="Join Aventa to discover vendors, save favorites, and manage your business."
      footer={
        <p>
          Already have an account?{" "}
          <Link href="/login">
            Sign in
          </Link>
        </p>
      }
    >
      <p>Signup form coming next.</p>
    </AuthCard>
  );
}