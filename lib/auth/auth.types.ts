import type { UserRole } from "@/types/user";

export interface SignUpInput {
  firstName: string;
  lastName: string;

  email: string;
  password: string;

  legalAccepted: boolean;

  role: Extract<UserRole, "customer" | "vendor">;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface AuthUser {
  uid: string;

  email: string | null;

  emailVerified: boolean;
}
