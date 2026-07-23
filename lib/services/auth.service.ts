import {
  createAuthAccount,
  reloadCurrentAuthUser,
  sendAuthPasswordResetEmail,
  sendCurrentUserVerificationEmail,
  signInAuthUser,
  signOutAuthUser,
  type SignInInput,
  type SignUpInput,
} from "@/lib/auth";

import {
  createUser,
  getUserById,
  updateEmailVerification,
} from "@/lib/repositories";

import {
  validatePasswordResetEmail,
  validateSignInInput,
  validateSignUpInput,
  ValidationError,
} from "@/lib/validation";

import type { UserProfile } from "@/types";

import { ServiceError } from "./service-error";

export async function signUp(input: SignUpInput): Promise<UserProfile> {
  const operation = "signUp";

  try {
    const validated = validateSignUpInput(input);

    const authUser = await createAuthAccount(
      validated.email,
      validated.password,
    );

    const profile = await createUser({
      id: authUser.uid,
      firstName: validated.firstName,
      lastName: validated.lastName,
      displayName: `${validated.firstName} ${validated.lastName}`,
      email: validated.email,
      role: input.role,
      legalAccepted: validated.legalAccepted,
    });

    await sendCurrentUserVerificationEmail();

    return profile;
  } catch (error) {
    if (error instanceof ValidationError || error instanceof ServiceError) {
      throw error;
    }

    throw new ServiceError(
      "Unable to complete sign up.",
      operation,
      "SIGN_UP_FAILED",
      error,
    );
  }
}

export async function signIn(input: SignInInput): Promise<UserProfile> {
  const operation = "signIn";

  try {
    const validated = validateSignInInput(input);

    const authUser = await signInAuthUser(validated);

    const profile = await getUserById(authUser.uid);

    if (!profile) {
      await signOutAuthUser();

      throw new ServiceError(
        "Your account profile could not be found.",
        operation,
        "USER_PROFILE_NOT_FOUND",
      );
    }

    if (!profile.active) {
      await signOutAuthUser();

      throw new ServiceError(
        "This account is inactive.",
        operation,
        "ACCOUNT_INACTIVE",
      );
    }

    if (profile.emailVerified !== authUser.emailVerified) {
      await updateEmailVerification(authUser.uid, authUser.emailVerified);

      return {
        ...profile,
        emailVerified: authUser.emailVerified,
        updatedAt: new Date(),
      };
    }

    return profile;
  } catch (error) {
    if (error instanceof ValidationError || error instanceof ServiceError) {
      throw error;
    }

    throw new ServiceError(
      "Unable to sign in.",
      operation,
      "SIGN_IN_FAILED",
      error,
    );
  }
}

export async function signOut(): Promise<void> {
  const operation = "signOut";

  try {
    await signOutAuthUser();
  } catch (error) {
    throw new ServiceError(
      "Unable to sign out.",
      operation,
      "SIGN_OUT_FAILED",
      error,
    );
  }
}

export async function sendPasswordReset(email: string): Promise<void> {
  const operation = "sendPasswordReset";

  try {
    const validatedEmail = validatePasswordResetEmail(email);

    await sendAuthPasswordResetEmail(validatedEmail);
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }

    throw new ServiceError(
      "Unable to send the password reset email.",
      operation,
      "PASSWORD_RESET_FAILED",
      error,
    );
  }
}

export async function synchronizeEmailVerification(
  userId: string,
  emailVerified: boolean,
): Promise<void> {
  const operation = "synchronizeEmailVerification";

  try {
    await updateEmailVerification(userId, emailVerified);
  } catch (error) {
    throw new ServiceError(
      "Unable to synchronize email verification.",
      operation,
      "EMAIL_VERIFICATION_SYNC_FAILED",
      error,
    );
  }
}

export async function resendVerificationEmail(): Promise<void> {
  const operation = "resendVerificationEmail";

  try {
    await sendCurrentUserVerificationEmail();
  } catch (error) {
    throw new ServiceError(
      "Unable to resend the verification email.",
      operation,
      "VERIFICATION_EMAIL_RESEND_FAILED",
      error,
    );
  }
}

export async function refreshCurrentUser(): Promise<{
  userId: string;
  email: string | null;
  emailVerified: boolean;
}> {
  const operation = "refreshCurrentUser";

  try {
    const authUser = await reloadCurrentAuthUser();

    if (authUser.emailVerified) {
      await synchronizeEmailVerification(authUser.uid, true);
    }

    return {
      userId: authUser.uid,
      email: authUser.email,
      emailVerified: authUser.emailVerified,
    };
  } catch (error) {
    if (error instanceof ServiceError) {
      throw error;
    }

    throw new ServiceError(
      "Unable to refresh your verification status.",
      operation,
      "EMAIL_VERIFICATION_REFRESH_FAILED",
      error,
    );
  }
}
