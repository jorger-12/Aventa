import {
  Timestamp,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { firestore } from "@/lib/firebase/client";
import { RepositoryError } from "@/lib/repositories";

import {
  CURRENT_DISCLAIMER_VERSION,
  CURRENT_PRIVACY_VERSION,
  CURRENT_TERMS_VERSION,
  type UserProfile,
} from "@/types/user";

import { COLLECTIONS } from "./collections";

interface FirestoreLegalAcceptance {
  termsAccepted?: boolean;
  termsAcceptedAt?: Timestamp;
  termsVersion?: string;

  privacyAccepted?: boolean;
  privacyAcceptedAt?: Timestamp;
  privacyVersion?: string;

  disclaimerAccepted?: boolean;
  disclaimerAcceptedAt?: Timestamp;
  disclaimerVersion?: string;
}

interface FirestoreUser {
  firstName: string;
  lastName: string;
  displayName: string;

  email: string;

  role: UserProfile["role"];

  avatarUrl?: string;

  emailVerified: boolean;
  active: boolean;

  legal?: FirestoreLegalAcceptance;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

function fromFirestore(id: string, data: FirestoreUser): UserProfile {
  const createdAt = data.createdAt?.toDate?.() ?? new Date();

  const updatedAt = data.updatedAt?.toDate?.() ?? createdAt;

  const legal = data.legal;

  return {
    id,

    firstName: data.firstName,
    lastName: data.lastName,
    displayName: data.displayName,

    email: data.email,

    role: data.role,

    avatarUrl: data.avatarUrl,

    emailVerified: data.emailVerified,
    active: data.active,

    legal: {
      termsAccepted: legal?.termsAccepted ?? false,

      termsAcceptedAt: legal?.termsAcceptedAt?.toDate?.() ?? createdAt,

      termsVersion: legal?.termsVersion ?? "unrecorded",

      privacyAccepted: legal?.privacyAccepted ?? false,

      privacyAcceptedAt: legal?.privacyAcceptedAt?.toDate?.() ?? createdAt,

      privacyVersion: legal?.privacyVersion ?? "unrecorded",

      disclaimerAccepted: legal?.disclaimerAccepted ?? false,

      disclaimerAcceptedAt:
        legal?.disclaimerAcceptedAt?.toDate?.() ?? createdAt,

      disclaimerVersion: legal?.disclaimerVersion ?? "unrecorded",
    },

    createdAt,
    updatedAt,
  };
}

export interface CreateUserInput {
  id: string;

  firstName: string;
  lastName: string;
  displayName: string;

  email: string;

  role: UserProfile["role"];

  legalAccepted: boolean;
}

export async function createUser(input: CreateUserInput): Promise<UserProfile> {
  try {
    if (!input.legalAccepted) {
      throw new RepositoryError(
        "Legal policies must be accepted before creating an account.",
        "createUser",
      );
    }

    const ref = doc(collection(firestore, COLLECTIONS.users), input.id);

    const now = Timestamp.now();

    await setDoc(ref, {
      firstName: input.firstName,
      lastName: input.lastName,
      displayName: input.displayName,

      email: input.email,

      role: input.role,

      emailVerified: false,
      active: true,

      legal: {
        termsAccepted: true,
        termsAcceptedAt: now,
        termsVersion: CURRENT_TERMS_VERSION,

        privacyAccepted: true,
        privacyAcceptedAt: now,
        privacyVersion: CURRENT_PRIVACY_VERSION,

        disclaimerAccepted: true,
        disclaimerAcceptedAt: now,
        disclaimerVersion: CURRENT_DISCLAIMER_VERSION,
      },

      createdAt: now,
      updatedAt: now,
    });

    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      throw new RepositoryError("Failed to create user.", "createUser");
    }

    return fromFirestore(snapshot.id, snapshot.data() as FirestoreUser);
  } catch (error) {
    if (error instanceof RepositoryError) {
      throw error;
    }

    throw new RepositoryError("Unable to create user.", "createUser", error);
  }
}

export async function getUserById(id: string): Promise<UserProfile | null> {
  try {
    const ref = doc(firestore, COLLECTIONS.users, id);

    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      return null;
    }

    return fromFirestore(snapshot.id, snapshot.data() as FirestoreUser);
  } catch (error) {
    throw new RepositoryError("Unable to fetch user.", "getUserById", error);
  }
}

export async function updateEmailVerification(
  id: string,
  emailVerified: boolean,
): Promise<void> {
  try {
    const ref = doc(firestore, COLLECTIONS.users, id);

    await updateDoc(ref, {
      emailVerified,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    throw new RepositoryError(
      "Unable to update verification status.",
      "updateEmailVerification",
      error,
    );
  }
}
