import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type DocumentData,
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
  type WithFieldValue,
} from "firebase/firestore";

import { firestore } from "@/lib/firebase/client";
import type { Vendor, VendorLocation, VendorMedia } from "@/types/vendor";

import { COLLECTIONS } from "./collections";
import { RepositoryError } from "./repository-error";

type FirestoreVendorLocation = Omit<
  VendorLocation,
  "createdAt" | "updatedAt"
> & {
  createdAt: Date;
  updatedAt: Date;
};

type FirestoreVendor = Omit<
  Vendor,
  "id" | "createdAt" | "updatedAt" | "locations"
> & {
  createdAt: Date;
  updatedAt: Date;
  locations: FirestoreVendorLocation[];
};

export type CreateVendorInput = Omit<
  Vendor,
  "id" | "createdAt" | "updatedAt" | "rating" | "reviewCount"
> & {
  id?: string;
};

export type UpdateVendorInput = Partial<
  Omit<Vendor, "id" | "ownerId" | "createdAt" | "updatedAt">
>;

const vendorConverter: FirestoreDataConverter<Vendor, FirestoreVendor> = {
  toFirestore(vendor: WithFieldValue<Vendor>): WithFieldValue<FirestoreVendor> {
    const { id: _id, ...vendorData } = vendor as Vendor;

    return vendorData;
  },

  fromFirestore(
    snapshot: QueryDocumentSnapshot<FirestoreVendor>,
    options: SnapshotOptions,
  ): Vendor {
    const data = snapshot.data(options);

    return {
      id: snapshot.id,
      ownerId: data.ownerId,
      businessName: data.businessName,
      slug: data.slug,

      primaryCategory: data.primaryCategory,
      categories: data.categories ?? [],
      services: data.services ?? [],

      shortDescription: data.shortDescription ?? "",
      description: data.description,

      phone: data.phone,
      email: data.email,
      website: data.website,

      facebook: data.facebook,
      instagram: data.instagram,
      tiktok: data.tiktok,

      media: normalizeMedia(data.media),
      locations: (data.locations ?? []).map(normalizeLocation),

      subscriptionPlan: data.subscriptionPlan,
      subscriptionStatus: data.subscriptionStatus,

      rating: data.rating ?? 0,
      reviewCount: data.reviewCount ?? 0,

      profileCompleted: data.profileCompleted ?? false,

      verified: data.verified ?? false,
      featured: data.featured ?? false,
      active: data.active ?? false,

      createdAt: toDate(data.createdAt),
      updatedAt: toDate(data.updatedAt),
    };
  },
};

function toDate(value: unknown): Date {
  if (value instanceof Date) {
    return value;
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    return value.toDate();
  }

  return new Date();
}

function normalizeMedia(media?: VendorMedia): VendorMedia {
  return {
    logoUrl: media?.logoUrl,
    coverImageUrl: media?.coverImageUrl,
    galleryImages: media?.galleryImages ?? [],
  };
}

function normalizeLocation(location: VendorLocation): VendorLocation {
  return {
    ...location,
    media: normalizeMedia(location.media),
    amenities: location.amenities ?? [],
    rating: location.rating ?? 0,
    reviewCount: location.reviewCount ?? 0,
    active: location.active ?? true,
    createdAt: toDate(location.createdAt),
    updatedAt: toDate(location.updatedAt),
  };
}

function vendorsCollection() {
  return collection(firestore, COLLECTIONS.vendors).withConverter(
    vendorConverter,
  );
}

function vendorDocument(vendorId: string) {
  return doc(firestore, COLLECTIONS.vendors, vendorId).withConverter(
    vendorConverter,
  );
}

export async function createVendor(input: CreateVendorInput): Promise<Vendor> {
  const operation = "createVendor";

  try {
    const vendorRef = input.id
      ? vendorDocument(input.id)
      : doc(vendorsCollection());

    const now = new Date();

    const vendor: FirestoreVendor = {
      ownerId: input.ownerId,
      businessName: input.businessName,
      slug: input.slug,
      primaryCategory: input.primaryCategory,
      categories: input.categories,
      services: input.services,
      shortDescription: input.shortDescription,
      description: input.description,
      phone: input.phone,
      email: input.email,
      website: input.website,
      facebook: input.facebook,
      instagram: input.instagram,
      tiktok: input.tiktok,
      media: normalizeMedia(input.media),
      locations: input.locations.map((location) => ({
        ...location,
        media: normalizeMedia(location.media),
        amenities: location.amenities ?? [],
        rating: location.rating ?? 0,
        reviewCount: location.reviewCount ?? 0,
        active: location.active ?? true,
        createdAt: location.createdAt ?? now,
        updatedAt: location.updatedAt ?? now,
      })),
      subscriptionPlan: input.subscriptionPlan,
      subscriptionStatus: input.subscriptionStatus,
      rating: 0,
      reviewCount: 0,
      profileCompleted: input.profileCompleted,
      verified: input.verified,
      featured: input.featured,
      active: input.active,
      createdAt: now,
      updatedAt: now,
    };

    const plainVendorRef = doc(firestore, COLLECTIONS.vendors, vendorRef.id);

    await setDoc(plainVendorRef, vendor);

    const createdVendor = await getVendorById(vendorRef.id);

    if (!createdVendor) {
      throw new Error("Vendor was created but could not be retrieved.");
    }

    return createdVendor;
  } catch (error) {
    throw new RepositoryError("Failed to create vendor.", operation, error);
  }
}

export async function getVendorById(vendorId: string): Promise<Vendor | null> {
  const operation = "getVendorById";

  try {
    const snapshot = await getDoc(vendorDocument(vendorId));

    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.data();
  } catch (error) {
    throw new RepositoryError("Failed to retrieve vendor.", operation, error);
  }
}

export async function getVendorsByOwnerId(ownerId: string): Promise<Vendor[]> {
  const operation = "getVendorsByOwnerId";

  try {
    const vendorQuery = query(
      vendorsCollection(),
      where("ownerId", "==", ownerId),
    );

    const snapshot = await getDocs(vendorQuery);

    return snapshot.docs.map((vendorSnapshot) => vendorSnapshot.data());
  } catch (error) {
    throw new RepositoryError(
      "Failed to retrieve vendors for this owner.",
      operation,
      error,
    );
  }
}

export async function getVendorBySlug(slug: string): Promise<Vendor | null> {
  const operation = "getVendorBySlug";

  try {
    const vendorQuery = query(vendorsCollection(), where("slug", "==", slug));

    const snapshot = await getDocs(vendorQuery);
    const firstVendor = snapshot.docs[0];

    return firstVendor ? firstVendor.data() : null;
  } catch (error) {
    throw new RepositoryError(
      "Failed to retrieve vendor by slug.",
      operation,
      error,
    );
  }
}

export async function updateVendor(
  vendorId: string,
  updates: UpdateVendorInput,
): Promise<Vendor> {
  const operation = "updateVendor";

  try {
    const vendorRef = doc(firestore, COLLECTIONS.vendors, vendorId);

    await updateDoc(vendorRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    const updatedVendor = await getVendorById(vendorId);

    if (!updatedVendor) {
      throw new Error("Updated vendor could not be retrieved.");
    }

    return updatedVendor;
  } catch (error) {
    throw new RepositoryError("Failed to update vendor.", operation, error);
  }
}

export async function deleteVendor(vendorId: string): Promise<void> {
  const operation = "deleteVendor";

  try {
    await deleteDoc(vendorDocument(vendorId));
  } catch (error) {
    throw new RepositoryError("Failed to delete vendor.", operation, error);
  }
}
