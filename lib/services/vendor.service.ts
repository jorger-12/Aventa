import {
  getCategoryById,
  getCategoryIdsFromBusinessTypes,
  getBusinessTypeById,
} from "@/data/categories";

import {
  createVendor as createVendorRecord,
  deleteVendor as deleteVendorRecord,
  getVendorById,
  getVendorBySlug,
  getVendorsByOwnerId,
  updateVendor as updateVendorRecord,
  type CreateVendorInput,
  type UpdateVendorInput,
} from "@/lib/repositories";

import type {
  SubscriptionPlan,
  SubscriptionStatus,
} from "@/types/subscription";

import type { Vendor, VendorLocation, VendorMedia } from "@/types/vendor";

import { ServiceError } from "./service-error";

export interface CreateVendorServiceInput {
  ownerId: string;

  businessName: string;
  slug?: string;

  primaryCategory: string;
  services: string[];

  shortDescription: string;
  description: string;

  phone: string;
  email: string;
  website?: string;

  facebook?: string;
  instagram?: string;
  tiktok?: string;

  media?: Partial<VendorMedia>;
  locations?: VendorLocation[];

  subscriptionPlan: SubscriptionPlan;
  subscriptionStatus: SubscriptionStatus;
}

export interface UpdateVendorServiceInput {
  businessName?: string;
  slug?: string;

  primaryCategory?: string;
  services?: string[];

  description?: string;

  phone?: string;
  email?: string;
  website?: string;

  media?: VendorMedia;
  locations?: VendorLocation[];

  subscriptionPlan?: SubscriptionPlan;
  subscriptionStatus?: SubscriptionStatus;

  active?: boolean;
}

function normalizeSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeWebsite(website?: string): string | undefined {
  const trimmedWebsite = website?.trim();

  return trimmedWebsite || undefined;
}

function createDefaultMedia(media?: Partial<VendorMedia>): VendorMedia {
  return {
    logoUrl: media?.logoUrl,
    coverImageUrl: media?.coverImageUrl,
    galleryImages: media?.galleryImages ?? [],
  };
}

function validateBusinessName(businessName: string): void {
  const normalizedName = businessName.trim();

  if (normalizedName.length < 2) {
    throw new ServiceError(
      "Business name must contain at least two characters.",
      "validateBusinessName",
      "INVALID_BUSINESS_NAME",
    );
  }

  if (normalizedName.length > 120) {
    throw new ServiceError(
      "Business name cannot exceed 120 characters.",
      "validateBusinessName",
      "INVALID_BUSINESS_NAME",
    );
  }
}

function validateDescription(description: string): void {
  const normalizedDescription = description.trim();

  if (normalizedDescription.length < 20) {
    throw new ServiceError(
      "Business description must contain at least 20 characters.",
      "validateDescription",
      "INVALID_DESCRIPTION",
    );
  }

  if (normalizedDescription.length > 5_000) {
    throw new ServiceError(
      "Business description cannot exceed 5,000 characters.",
      "validateDescription",
      "INVALID_DESCRIPTION",
    );
  }
}

function validatePrimaryCategory(primaryCategory: string): void {
  const category = getCategoryById(primaryCategory);

  if (!category) {
    throw new ServiceError(
      "The selected primary category is invalid or inactive.",
      "validatePrimaryCategory",
      "INVALID_CATEGORY",
    );
  }
}

function validateServices(serviceIds: string[]): string[] {
  const uniqueServiceIds = [...new Set(serviceIds)];

  if (uniqueServiceIds.length === 0) {
    throw new ServiceError(
      "At least one service must be selected.",
      "validateServices",
      "NO_SERVICES_SELECTED",
    );
  }

  for (const serviceId of uniqueServiceIds) {
    const service = getBusinessTypeById(serviceId);

    if (!service) {
      throw new ServiceError(
        `The selected service "${serviceId}" is invalid or inactive.`,
        "validateServices",
        "INVALID_SERVICE",
      );
    }
  }

  return uniqueServiceIds;
}

function validatePrimaryCategoryMatchesServices(
  primaryCategory: string,
  serviceIds: string[],
): string[] {
  const categoryIds = getCategoryIdsFromBusinessTypes(serviceIds);

  if (!categoryIds.includes(primaryCategory)) {
    throw new ServiceError(
      "The primary category must match at least one selected service.",
      "validatePrimaryCategoryMatchesServices",
      "PRIMARY_CATEGORY_MISMATCH",
    );
  }

  return categoryIds;
}

async function ensureSlugAvailable(
  slug: string,
  excludedVendorId?: string,
): Promise<void> {
  const existingVendor = await getVendorBySlug(slug);

  if (existingVendor && existingVendor.id !== excludedVendorId) {
    throw new ServiceError(
      "That business URL is already being used.",
      "ensureSlugAvailable",
      "SLUG_ALREADY_EXISTS",
    );
  }
}

export async function createVendor(
  input: CreateVendorServiceInput,
): Promise<Vendor> {
  const operation = "createVendor";

  try {
    validateBusinessName(input.businessName);
    validateDescription(input.description);
    validatePrimaryCategory(input.primaryCategory);

    const services = validateServices(input.services);

    const categories = validatePrimaryCategoryMatchesServices(
      input.primaryCategory,
      services,
    );

    const slug = normalizeSlug(input.slug || input.businessName);

    if (!slug) {
      throw new ServiceError(
        "A valid business URL could not be generated.",
        operation,
        "INVALID_SLUG",
      );
    }

    await ensureSlugAvailable(slug);

    const repositoryInput: CreateVendorInput = {
      ownerId: input.ownerId,
      businessName: input.businessName.trim(),
      slug,

      primaryCategory: input.primaryCategory,
      categories,
      services,

      shortDescription: input.shortDescription.trim(),

      description: input.description.trim(),

      phone: input.phone.trim(),
      email: normalizeEmail(input.email),
      website: normalizeWebsite(input.website),

      facebook: input.facebook,
      instagram: input.instagram,
      tiktok: input.tiktok,

      media: createDefaultMedia(input.media),
      locations: input.locations ?? [],

      subscriptionPlan: input.subscriptionPlan,
      subscriptionStatus: input.subscriptionStatus,

      profileCompleted: false,

      verified: false,
      featured: false,
      active: false,
    };

    return await createVendorRecord(repositoryInput);
  } catch (error) {
    if (error instanceof ServiceError) {
      throw error;
    }

    throw new ServiceError(
      "Failed to create the vendor profile.",
      operation,
      "CREATE_VENDOR_FAILED",
      error,
    );
  }
}

export async function updateVendor(
  vendorId: string,
  input: UpdateVendorServiceInput,
): Promise<Vendor> {
  const operation = "updateVendor";

  try {
    const existingVendor = await getVendorById(vendorId);

    if (!existingVendor) {
      throw new ServiceError(
        "Vendor profile not found.",
        operation,
        "VENDOR_NOT_FOUND",
      );
    }

    if (input.businessName !== undefined) {
      validateBusinessName(input.businessName);
    }

    if (input.description !== undefined) {
      validateDescription(input.description);
    }

    const primaryCategory =
      input.primaryCategory ?? existingVendor.primaryCategory;

    const services =
      input.services !== undefined
        ? validateServices(input.services)
        : existingVendor.services;

    validatePrimaryCategory(primaryCategory);

    const categories = validatePrimaryCategoryMatchesServices(
      primaryCategory,
      services,
    );

    let slug: string | undefined;

    if (input.slug !== undefined) {
      slug = normalizeSlug(input.slug);

      if (!slug) {
        throw new ServiceError(
          "The business URL is invalid.",
          operation,
          "INVALID_SLUG",
        );
      }

      await ensureSlugAvailable(slug, vendorId);
    }

    const updates: UpdateVendorInput = {
      ...input,
      primaryCategory,
      categories,
      services,
    };

    if (input.businessName !== undefined) {
      updates.businessName = input.businessName.trim();
    }

    if (input.description !== undefined) {
      updates.description = input.description.trim();
    }

    if (input.phone !== undefined) {
      updates.phone = input.phone.trim();
    }

    if (input.email !== undefined) {
      updates.email = normalizeEmail(input.email);
    }

    if (input.website !== undefined) {
      updates.website = normalizeWebsite(input.website);
    }

    if (slug !== undefined) {
      updates.slug = slug;
    }

    return await updateVendorRecord(vendorId, updates);
  } catch (error) {
    if (error instanceof ServiceError) {
      throw error;
    }

    throw new ServiceError(
      "Failed to update the vendor profile.",
      operation,
      "UPDATE_VENDOR_FAILED",
      error,
    );
  }
}

export async function getVendor(vendorId: string): Promise<Vendor> {
  const vendor = await getVendorById(vendorId);

  if (!vendor) {
    throw new ServiceError(
      "Vendor profile not found.",
      "getVendor",
      "VENDOR_NOT_FOUND",
    );
  }

  return vendor;
}

export async function getOwnerVendors(ownerId: string): Promise<Vendor[]> {
  if (!ownerId.trim()) {
    throw new ServiceError(
      "An owner ID is required.",
      "getOwnerVendors",
      "INVALID_OWNER_ID",
    );
  }

  return getVendorsByOwnerId(ownerId);
}

export async function removeVendor(vendorId: string): Promise<void> {
  const vendor = await getVendorById(vendorId);

  if (!vendor) {
    throw new ServiceError(
      "Vendor profile not found.",
      "removeVendor",
      "VENDOR_NOT_FOUND",
    );
  }

  await deleteVendorRecord(vendorId);
}
