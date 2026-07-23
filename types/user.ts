export const CURRENT_TERMS_VERSION = "1.0";
export const CURRENT_PRIVACY_VERSION = "1.0";
export const CURRENT_DISCLAIMER_VERSION = "1.0";

export interface UserLegalAcceptance {
  termsAccepted: boolean;
  termsAcceptedAt: Date;
  termsVersion: string;

  privacyAccepted: boolean;
  privacyAcceptedAt: Date;
  privacyVersion: string;

  disclaimerAccepted: boolean;
  disclaimerAcceptedAt: Date;
  disclaimerVersion: string;
}

export type UserRole = "customer" | "vendor" | "admin";

export interface UserProfile {
  id: string;

  // Identity
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;

  // Account
  role: UserRole;
  emailVerified: boolean;
  active: boolean;

  // Legal
  legal: UserLegalAcceptance;

  // Profile
  avatarUrl?: string;

  // Dates
  createdAt: Date;
  updatedAt: Date;
}
