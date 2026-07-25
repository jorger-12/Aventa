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

export interface VendorServiceCategoryInput {
  categoryId: string;
  businessTypeIds: string[];
}

export interface CreateVendorServiceInput {
  ownerId: string;

  businessName: string;
  slug?: string;

  serviceCategories: VendorServiceCategoryInput[];

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

  serviceCategories?: VendorServiceCategoryInput[];

  shortDescription?: string;
  description?: string;

  phone?: string;
  email?: string;
  website?: string;

  facebook?: string;
  instagram?: string;
  tiktok?: string;

  media?: VendorMedia;
  locations?: VendorLocation[];

  subscriptionPlan?: SubscriptionPlan;
  subscriptionStatus?: SubscriptionStatus;

  profileCompleted?: boolean;

  verified?: boolean;
  featured?: boolean;
  active?: boolean;
}

interface ValidatedServiceCategories {
  primaryCategoryId: string;
  businessCategoryIds: string[];
  businessTypeIds: string[];
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

function normalizeOptionalText(value?: string): string | undefined {
  const normalizedValue = value?.trim();

  return normalizedValue || undefined;
}

function normalizeWebsite(website?: string): string | undefined {
  return normalizeOptionalText(website);
}

function createDefaultMedia(media?: Partial<VendorMedia>): VendorMedia {
  return {
    logoUrl: media?.logoUrl,
    coverImageUrl: media?.coverImageUrl,
    galleryImages: media?.galleryImages ?? [],
  };
}

function validateOwnerId(ownerId: string): void {
  if (!ownerId.trim()) {
    throw new ServiceError(
      "An owner ID is required.",
      "validateOwnerId",
      "INVALID_OWNER_ID",
    );
  }
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

function validateShortDescription(shortDescription: string): void {
  const normalizedDescription = shortDescription.trim();

  if (normalizedDescription.length < 10) {
    throw new ServiceError(
      "Short description must contain at least 10 characters.",
      "validateShortDescription",
      "INVALID_SHORT_DESCRIPTION",
    );
  }

  if (normalizedDescription.length > 250) {
    throw new ServiceError(
      "Short description cannot exceed 250 characters.",
      "validateShortDescription",
      "INVALID_SHORT_DESCRIPTION",
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

function validateEmail(email: string): void {
  const normalizedEmail = normalizeEmail(email);

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(normalizedEmail)) {
    throw new ServiceError(
      "Enter a valid business email address.",
      "validateEmail",
      "INVALID_EMAIL",
    );
  }
}

function validatePhone(phone: string): void {
  const normalizedPhone = phone.trim();

  if (normalizedPhone.length < 7) {
    throw new ServiceError(
      "Enter a valid business phone number.",
      "validatePhone",
      "INVALID_PHONE",
    );
  }
}

function validateServiceCategories(
  serviceCategories: VendorServiceCategoryInput[],
): ValidatedServiceCategories {
  if (!Array.isArray(serviceCategories) || serviceCategories.length === 0) {
    throw new ServiceError(
      "At least one service category must be selected.",
      "validateServiceCategories",
      "NO_SERVICE_CATEGORIES_SELECTED",
    );
  }

  const normalizedSelections = serviceCategories.map((selection) => ({
    categoryId: selection.categoryId.trim(),
    businessTypeIds: [
      ...new Set(
        selection.businessTypeIds
          .map((businessTypeId) => businessTypeId.trim())
          .filter(Boolean),
      ),
    ],
  }));

  const selectedCategoryIds = normalizedSelections.map(
    (selection) => selection.categoryId,
  );

  if (selectedCategoryIds.some((categoryId) => !categoryId)) {
    throw new ServiceError(
      "Every service selection must include a category.",
      "validateServiceCategories",
      "INVALID_CATEGORY",
    );
  }

  const uniqueCategoryIds = [...new Set(selectedCategoryIds)];

  if (uniqueCategoryIds.length !== selectedCategoryIds.length) {
    throw new ServiceError(
      "The same service category cannot be selected more than once.",
      "validateServiceCategories",
      "DUPLICATE_SERVICE_CATEGORY",
    );
  }

  const allBusinessTypeIds: string[] = [];

  for (const selection of normalizedSelections) {
    const category = getCategoryById(selection.categoryId);

    if (!category) {
      throw new ServiceError(
        `The selected category "${selection.categoryId}" is invalid or inactive.`,
        "validateServiceCategories",
        "INVALID_CATEGORY",
      );
    }

    if (selection.businessTypeIds.length === 0) {
      throw new ServiceError(
        "At least one service must be selected for every category.",
        "validateServiceCategories",
        "NO_SERVICES_SELECTED",
      );
    }

    for (const businessTypeId of selection.businessTypeIds) {
      const businessType = getBusinessTypeById(businessTypeId);

      if (!businessType) {
        throw new ServiceError(
          `The selected service "${businessTypeId}" is invalid or inactive.`,
          "validateServiceCategories",
          "INVALID_SERVICE",
        );
      }

      const matchingCategoryIds = getCategoryIdsFromBusinessTypes([
        businessTypeId,
      ]);

      if (!matchingCategoryIds.includes(selection.categoryId)) {
        throw new ServiceError(
          `The selected service "${businessTypeId}" does not belong to category "${selection.categoryId}".`,
          "validateServiceCategories",
          "SERVICE_CATEGORY_MISMATCH",
        );
      }

      allBusinessTypeIds.push(businessTypeId);
    }
  }

  return {
    primaryCategoryId: uniqueCategoryIds[0],
    businessCategoryIds: uniqueCategoryIds,
    businessTypeIds: [...new Set(allBusinessTypeIds)],
  };
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
    validateOwnerId(input.ownerId);
    validateBusinessName(input.businessName);
    validateShortDescription(input.shortDescription);
    validateDescription(input.description);
    validatePhone(input.phone);
    validateEmail(input.email);

    const { primaryCategoryId, businessCategoryIds, businessTypeIds } =
      validateServiceCategories(input.serviceCategories);

    const slug = normalizeSlug(input.slug || input.businessName);

    if (!slug) {
      throw new ServiceError(
        "A valid business URL could not be generated.",
        operation,
        "INVALID_SLUG",
      );
    }

    // Temporarily disabled until slug lookup permissions are configured.
    // await ensureSlugAvailable(slug);

    const repositoryInput: CreateVendorInput = {
      ownerId: input.ownerId.trim(),

      businessName: input.businessName.trim(),
      slug,

      primaryCategoryId,
      businessCategoryIds,
      businessTypeIds,

      shortDescription: input.shortDescription.trim(),
      description: input.description.trim(),

      phone: input.phone.trim(),
      email: normalizeEmail(input.email),
      website: normalizeWebsite(input.website),

      facebook: normalizeOptionalText(input.facebook),
      instagram: normalizeOptionalText(input.instagram),
      tiktok: normalizeOptionalText(input.tiktok),

      media: createDefaultMedia(input.media),
      locations: input.locations ?? [],

      subscriptionPlan: input.subscriptionPlan,
      subscriptionStatus: input.subscriptionStatus,

      profileCompleted: true,

      verified: false,
      featured: false,
      active: true,
    };

    return await createVendorRecord(repositoryInput);
  } catch (error) {
    console.error("Vendor service error:", error);
    throw error;
  }
}

export async function updateVendor(
  vendorId: string,
  input: UpdateVendorServiceInput,
): Promise<Vendor> {
  const operation = "updateVendor";

  try {
    if (!vendorId.trim()) {
      throw new ServiceError(
        "A vendor ID is required.",
        operation,
        "INVALID_VENDOR_ID",
      );
    }

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

    if (input.shortDescription !== undefined) {
      validateShortDescription(input.shortDescription);
    }

    if (input.description !== undefined) {
      validateDescription(input.description);
    }

    if (input.phone !== undefined) {
      validatePhone(input.phone);
    }

    if (input.email !== undefined) {
      validateEmail(input.email);
    }

    const serviceCategoryUpdates =
      input.serviceCategories !== undefined
        ? validateServiceCategories(input.serviceCategories)
        : undefined;

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

    const { serviceCategories: _serviceCategories, ...remainingInput } = input;

    const updates: UpdateVendorInput = {
      ...remainingInput,
    };

    if (serviceCategoryUpdates) {
      updates.primaryCategoryId = serviceCategoryUpdates.primaryCategoryId;

      updates.businessCategoryIds = serviceCategoryUpdates.businessCategoryIds;

      updates.businessTypeIds = serviceCategoryUpdates.businessTypeIds;
    }

    if (input.businessName !== undefined) {
      updates.businessName = input.businessName.trim();
    }

    if (input.shortDescription !== undefined) {
      updates.shortDescription = input.shortDescription.trim();
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

    if (input.facebook !== undefined) {
      updates.facebook = normalizeOptionalText(input.facebook);
    }

    if (input.instagram !== undefined) {
      updates.instagram = normalizeOptionalText(input.instagram);
    }

    if (input.tiktok !== undefined) {
      updates.tiktok = normalizeOptionalText(input.tiktok);
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
  if (!vendorId.trim()) {
    throw new ServiceError(
      "A vendor ID is required.",
      "getVendor",
      "INVALID_VENDOR_ID",
    );
  }

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

  return getVendorsByOwnerId(ownerId.trim());
}

export async function removeVendor(vendorId: string): Promise<void> {
  if (!vendorId.trim()) {
    throw new ServiceError(
      "A vendor ID is required.",
      "removeVendor",
      "INVALID_VENDOR_ID",
    );
  }

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
