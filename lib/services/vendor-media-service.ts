import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
  type UploadMetadata,
  type UploadTaskSnapshot,
} from "firebase/storage";

import { firebaseStorage } from "@/lib/firebase/client";
import type { VendorMedia } from "@/types/vendor";

import { ServiceError } from "./service-error";

export type VendorMediaPurpose = "logo" | "cover" | "gallery";

export interface VendorMediaUploadInput {
  vendorId: string;
  ownerId: string;
  file: File;
  purpose: VendorMediaPurpose;
  order?: number;
}

export interface VendorMediaUploadResult {
  url: string;
  storagePath: string;
  originalFileName: string;
  contentType: string;
  size: number;
}

export interface UploadVendorMediaInput {
  vendorId: string;
  ownerId: string;

  logoFile?: File | null;
  coverFile?: File | null;
  galleryFiles?: File[];

  onProgress?: (progress: VendorMediaUploadProgress) => void;
}

export interface VendorMediaUploadProgress {
  purpose: VendorMediaPurpose;
  fileName: string;
  fileIndex: number;
  totalFiles: number;
  fileProgress: number;
  overallProgress: number;
}

export interface UploadVendorMediaResult {
  media: VendorMedia;

  uploadedFiles: {
    logo?: VendorMediaUploadResult;
    cover?: VendorMediaUploadResult;
    gallery: VendorMediaUploadResult[];
  };
}

const MAX_LOGO_SIZE = 5 * 1024 * 1024;
const MAX_COVER_SIZE = 10 * 1024 * 1024;
const MAX_GALLERY_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_GALLERY_IMAGES = 50;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

function validateRequiredId(
  value: string,
  fieldName: "vendorId" | "ownerId",
): string {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    throw new ServiceError(
      `${fieldName === "vendorId" ? "Vendor" : "Owner"} ID is required.`,
      "validateRequiredId",
      fieldName === "vendorId" ? "INVALID_VENDOR_ID" : "INVALID_OWNER_ID",
    );
  }

  return normalizedValue;
}

function validateImageFile(file: File, purpose: VendorMediaPurpose): void {
  if (!(file instanceof File)) {
    throw new ServiceError(
      "A valid image file is required.",
      "validateImageFile",
      "INVALID_MEDIA_FILE",
    );
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new ServiceError(
      `"${file.name}" must be a JPEG, PNG, WebP, or AVIF image.`,
      "validateImageFile",
      "INVALID_MEDIA_TYPE",
    );
  }

  const maximumSize =
    purpose === "logo"
      ? MAX_LOGO_SIZE
      : purpose === "cover"
        ? MAX_COVER_SIZE
        : MAX_GALLERY_IMAGE_SIZE;

  if (file.size > maximumSize) {
    const maximumSizeMb = Math.round(maximumSize / 1024 / 1024);

    throw new ServiceError(
      `"${file.name}" cannot exceed ${maximumSizeMb} MB.`,
      "validateImageFile",
      "MEDIA_FILE_TOO_LARGE",
    );
  }
}

function sanitizeFileName(fileName: string): string {
  const extensionIndex = fileName.lastIndexOf(".");

  const rawBaseName =
    extensionIndex >= 0 ? fileName.slice(0, extensionIndex) : fileName;

  const extension =
    extensionIndex >= 0 ? fileName.slice(extensionIndex).toLowerCase() : "";

  const safeBaseName = rawBaseName
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  return `${safeBaseName || "image"}${extension}`;
}

function createUniqueFileName(file: File): string {
  const safeName = sanitizeFileName(file.name);

  return `${Date.now()}-${crypto.randomUUID()}-${safeName}`;
}

function createStoragePath(
  ownerId: string,
  vendorId: string,
  purpose: VendorMediaPurpose,
  fileName: string,
): string {
  return ["vendors", ownerId, vendorId, purpose, fileName].join("/");
}

function uploadFile(
  input: VendorMediaUploadInput,
  onProgress?: (progress: number) => void,
): Promise<VendorMediaUploadResult> {
  const vendorId = validateRequiredId(input.vendorId, "vendorId");

  const ownerId = validateRequiredId(input.ownerId, "ownerId");

  validateImageFile(input.file, input.purpose);

  const uniqueFileName = createUniqueFileName(input.file);

  const storagePath = createStoragePath(
    ownerId,
    vendorId,
    input.purpose,
    uniqueFileName,
  );

  const storageReference = ref(firebaseStorage, storagePath);

  const metadata: UploadMetadata = {
    contentType: input.file.type,

    customMetadata: {
      ownerId,
      vendorId,
      purpose: input.purpose,
      originalFileName: input.file.name,
      order: String(input.order ?? 0),
    },
  };

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(
      storageReference,
      input.file,
      metadata,
    );

    uploadTask.on(
      "state_changed",

      (snapshot: UploadTaskSnapshot) => {
        const progress =
          snapshot.totalBytes > 0
            ? (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            : 0;

        onProgress?.(Math.round(progress));
      },

      (error) => {
        reject(
          new ServiceError(
            `Failed to upload "${input.file.name}".`,
            "uploadFile",
            "MEDIA_UPLOAD_FAILED",
            error,
          ),
        );
      },

      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);

          resolve({
            url,
            storagePath,
            originalFileName: input.file.name,
            contentType: input.file.type,
            size: input.file.size,
          });
        } catch (error) {
          reject(
            new ServiceError(
              `The upload finished, but the URL for "${input.file.name}" could not be retrieved.`,
              "uploadFile",
              "MEDIA_URL_FAILED",
              error,
            ),
          );
        }
      },
    );
  });
}

function calculateOverallProgress(
  completedFiles: number,
  currentFileProgress: number,
  totalFiles: number,
): number {
  if (totalFiles === 0) {
    return 100;
  }

  const totalProgress = completedFiles * 100 + currentFileProgress;

  return Math.round(totalProgress / totalFiles);
}

export async function uploadVendorMedia(
  input: UploadVendorMediaInput,
): Promise<UploadVendorMediaResult> {
  const operation = "uploadVendorMedia";

  try {
    const vendorId = validateRequiredId(input.vendorId, "vendorId");

    const ownerId = validateRequiredId(input.ownerId, "ownerId");

    const galleryFiles = input.galleryFiles ?? [];

    if (galleryFiles.length > MAX_GALLERY_IMAGES) {
      throw new ServiceError(
        `A vendor cannot upload more than ${MAX_GALLERY_IMAGES} gallery images.`,
        operation,
        "TOO_MANY_GALLERY_IMAGES",
      );
    }

    const filesToUpload: Array<{
      file: File;
      purpose: VendorMediaPurpose;
      order: number;
    }> = [];

    if (input.logoFile) {
      filesToUpload.push({
        file: input.logoFile,
        purpose: "logo",
        order: 0,
      });
    }

    if (input.coverFile) {
      filesToUpload.push({
        file: input.coverFile,
        purpose: "cover",
        order: 0,
      });
    }

    galleryFiles.forEach((file, index) => {
      filesToUpload.push({
        file,
        purpose: "gallery",
        order: index,
      });
    });

    const uploadedFiles: UploadVendorMediaResult["uploadedFiles"] = {
      gallery: [],
    };

    let completedFiles = 0;

    for (let fileIndex = 0; fileIndex < filesToUpload.length; fileIndex += 1) {
      const upload = filesToUpload[fileIndex];

      const result = await uploadFile(
        {
          vendorId,
          ownerId,
          file: upload.file,
          purpose: upload.purpose,
          order: upload.order,
        },
        (fileProgress) => {
          input.onProgress?.({
            purpose: upload.purpose,
            fileName: upload.file.name,
            fileIndex,
            totalFiles: filesToUpload.length,
            fileProgress,
            overallProgress: calculateOverallProgress(
              completedFiles,
              fileProgress,
              filesToUpload.length,
            ),
          });
        },
      );

      if (upload.purpose === "logo") {
        uploadedFiles.logo = result;
      } else if (upload.purpose === "cover") {
        uploadedFiles.cover = result;
      } else {
        uploadedFiles.gallery.push(result);
      }

      completedFiles += 1;
    }

    return {
      media: {
        logoUrl: uploadedFiles.logo?.url,
        coverImageUrl: uploadedFiles.cover?.url,
        galleryImages: uploadedFiles.gallery.map((image) => image.url),
      },

      uploadedFiles,
    };
  } catch (error) {
    if (error instanceof ServiceError) {
      throw error;
    }

    throw new ServiceError(
      "Failed to upload vendor media.",
      operation,
      "VENDOR_MEDIA_UPLOAD_FAILED",
      error,
    );
  }
}

export async function deleteVendorMediaFile(
  storagePath: string,
): Promise<void> {
  const operation = "deleteVendorMediaFile";
  const normalizedPath = storagePath.trim();

  if (!normalizedPath) {
    throw new ServiceError(
      "A storage path is required.",
      operation,
      "INVALID_STORAGE_PATH",
    );
  }

  try {
    await deleteObject(ref(firebaseStorage, normalizedPath));
  } catch (error) {
    throw new ServiceError(
      "Failed to delete the vendor media file.",
      operation,
      "MEDIA_DELETE_FAILED",
      error,
    );
  }
}
