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
import type { UserProfile } from "@/types";

import { COLLECTIONS } from "./collections";

interface FirestoreUser {
  firstName: string;
  lastName: string;
  displayName: string;

  email: string;

  role: UserProfile["role"];

  avatarUrl?: string;

  emailVerified: boolean;
  active: boolean;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

function fromFirestore(id: string, data: FirestoreUser): UserProfile {
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

    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  };
}

export interface CreateUserInput {
  id: string;

  firstName: string;
  lastName: string;
  displayName: string;

  email: string;

  role: UserProfile["role"];
}

export async function createUser(input: CreateUserInput): Promise<UserProfile> {
  try {
    const ref = doc(collection(firestore, COLLECTIONS.users), input.id);

    await setDoc(ref, {
      firstName: input.firstName,
      lastName: input.lastName,
      displayName: input.displayName,

      email: input.email,

      role: input.role,

      avatarUrl: undefined,

      emailVerified: false,
      active: true,

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      throw new RepositoryError("Failed to create user.", "createUser");
    }

    return fromFirestore(snapshot.id, snapshot.data() as FirestoreUser);
  } catch (error) {
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
