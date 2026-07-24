import type {
  ImagePurpose,
  ImageValidationOptions,
  ImageValidationResult,
  UploadedImage,
} from "./types";

export const DEFAULT_ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const DEFAULT_MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

export function validateImageFile(
  file: File,
  options: ImageValidationOptions,
): ImageValidationResult {
  if (!options.acceptedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Only JPG, PNG, and WebP images are allowed.",
    };
  }

  if (file.size > options.maxFileSizeBytes) {
    const maximumSizeMb = Math.round(options.maxFileSizeBytes / (1024 * 1024));

    return {
      valid: false,
      error: `This image exceeds the ${maximumSizeMb} MB file-size limit.`,
    };
  }

  return {
    valid: true,
    error: null,
  };
}

export function createImageId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createUploadedImage(
  file: File,
  purpose: ImagePurpose,
  order?: number,
): UploadedImage {
  return {
    id: createImageId(),
    file,
    previewUrl: URL.createObjectURL(file),
    purpose,
    status: "ready",
    progress: 0,
    error: null,
    order,
  };
}
