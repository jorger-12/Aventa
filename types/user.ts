export type UserRole = "customer" | "vendor" | "admin";

export interface UserProfile {
  id: string;

  firstName: string;
  lastName: string;
  displayName: string;

  email: string;
  role: UserRole;

  avatarUrl?: string;

  emailVerified: boolean;
  active: boolean;

  createdAt: Date;
  updatedAt: Date;
}
