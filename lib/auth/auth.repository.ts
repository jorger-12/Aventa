import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type Unsubscribe,
  type User,
} from "firebase/auth";

import { firebaseAuth } from "@/lib/firebase/client";

import { AuthError } from "./auth.errors";
import type { AuthUser, SignInInput } from "./auth.types";

function mapAuthUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    emailVerified: user.emailVerified,
  };
}

function getFirebaseErrorCode(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code;
  }

  return "auth/unknown";
}

function createReadableAuthError(error: unknown, operation: string): AuthError {
  const firebaseCode = getFirebaseErrorCode(error);

  switch (firebaseCode) {
    case "auth/email-already-in-use":
      return new AuthError(
        "An account already exists with this email address.",
        operation,
        firebaseCode,
        error,
      );

    case "auth/invalid-email":
      return new AuthError(
        "Enter a valid email address.",
        operation,
        firebaseCode,
        error,
      );

    case "auth/weak-password":
      return new AuthError(
        "The password is too weak.",
        operation,
        firebaseCode,
        error,
      );

    case "auth/invalid-credential":
      return new AuthError(
        "The email or password is incorrect.",
        operation,
        firebaseCode,
        error,
      );

    case "auth/user-disabled":
      return new AuthError(
        "This account has been disabled.",
        operation,
        firebaseCode,
        error,
      );

    case "auth/too-many-requests":
      return new AuthError(
        "Too many attempts were made. Please try again later.",
        operation,
        firebaseCode,
        error,
      );

    case "auth/network-request-failed":
      return new AuthError(
        "Unable to connect. Check your internet connection.",
        operation,
        firebaseCode,
        error,
      );

    default:
      return new AuthError(
        "Authentication could not be completed.",
        operation,
        firebaseCode,
        error,
      );
  }
}

export async function createAuthAccount(
  email: string,
  password: string,
): Promise<AuthUser> {
  const operation = "createAuthAccount";

  try {
    const credential = await createUserWithEmailAndPassword(
      firebaseAuth,
      email.trim().toLowerCase(),
      password,
    );

    return mapAuthUser(credential.user);
  } catch (error) {
    throw createReadableAuthError(error, operation);
  }
}

export async function signInAuthUser(input: SignInInput): Promise<AuthUser> {
  const operation = "signInAuthUser";

  try {
    const credential = await signInWithEmailAndPassword(
      firebaseAuth,
      input.email.trim().toLowerCase(),
      input.password,
    );

    return mapAuthUser(credential.user);
  } catch (error) {
    throw createReadableAuthError(error, operation);
  }
}

export async function sendCurrentUserVerificationEmail(): Promise<void> {
  const operation = "sendCurrentUserVerificationEmail";

  try {
    const currentUser = firebaseAuth.currentUser;

    if (!currentUser) {
      throw new AuthError(
        "No authenticated user is available.",
        operation,
        "AUTH_USER_NOT_FOUND",
      );
    }

    await sendEmailVerification(currentUser);
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }

    throw createReadableAuthError(error, operation);
  }
}

export async function sendAuthPasswordResetEmail(email: string): Promise<void> {
  const operation = "sendAuthPasswordResetEmail";

  try {
    await sendPasswordResetEmail(firebaseAuth, email.trim().toLowerCase());
  } catch (error) {
    throw createReadableAuthError(error, operation);
  }
}

export async function signOutAuthUser(): Promise<void> {
  const operation = "signOutAuthUser";

  try {
    await signOut(firebaseAuth);
  } catch (error) {
    throw createReadableAuthError(error, operation);
  }
}

export function getCurrentAuthUser(): AuthUser | null {
  const currentUser = firebaseAuth.currentUser;

  return currentUser ? mapAuthUser(currentUser) : null;
}

export function subscribeToAuthState(
  callback: (user: AuthUser | null) => void,
): Unsubscribe {
  return onAuthStateChanged(
    firebaseAuth,
    (user) => {
      callback(user ? mapAuthUser(user) : null);
    },
    (error) => {
      console.error("Firebase authentication state listener failed:", error);

      callback(null);
    },
  );
}

export async function reloadCurrentAuthUser(): Promise<AuthUser> {
  const operation = "reloadCurrentAuthUser";

  try {
    const currentUser = firebaseAuth.currentUser;

    if (!currentUser) {
      throw new AuthError(
        "You must be signed in to verify your email.",
        operation,
        "AUTH_USER_NOT_FOUND",
      );
    }

    await reload(currentUser);

    const refreshedUser = firebaseAuth.currentUser;

    if (!refreshedUser) {
      throw new AuthError(
        "Your authentication session could not be refreshed.",
        operation,
        "AUTH_USER_NOT_FOUND",
      );
    }

    return mapAuthUser(refreshedUser);
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }

    throw createReadableAuthError(error, operation);
  }
}
