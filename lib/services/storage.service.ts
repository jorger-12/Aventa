import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { firebaseStorage } from "@/lib/firebase/client";

import type { UploadedImage } from "@/components/ui/ImageUploader";

export interface UploadedVendorImage {
  id: string;
  downloadUrl: string;
  storagePath: string;
  order?: number;
}

interface UploadVendorImageOptions {
  ownerId: string;
  vendorId: string;
  image: UploadedImage;
  folder: "logo" | "cover" | "gallery";
  onProgress?: (progress: number) => void;
}

function sanitizeFileName(fileName: string): string {
  const extension = fileName.includes(".")
    ? fileName.split(".").pop()?.toLowerCase()
    : undefined;

  const baseName = fileName
    .replace(/\.[^/.]+$/, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const safeBaseName = baseName || "image";

  return extension ? `${safeBaseName}.${extension}` : safeBaseName;
}

function createStorageFileName(image: UploadedImage): string {
  const sanitizedName = sanitizeFileName(image.file.name);

  return `${image.id}-${sanitizedName}`;
}

function createVendorStoragePath(
  ownerId: string,
  vendorId: string,
  folder: "logo" | "cover" | "gallery",
  image: UploadedImage,
): string {
  const fileName = createStorageFileName(image);

  return `vendors/${ownerId}/${vendorId}/${folder}/${fileName}`;
}

function validateUploadInput(
  ownerId: string,
  vendorId: string,
  image: UploadedImage,
): void {
  if (!ownerId.trim()) {
    throw new Error("An owner ID is required to upload vendor media.");
  }

  if (!vendorId.trim()) {
    throw new Error("A vendor ID is required to upload vendor media.");
  }

  if (!(image.file instanceof File)) {
    throw new Error("A valid image file is required.");
  }
}

async function uploadVendorImage({
  ownerId,
  vendorId,
  image,
  folder,
  onProgress,
}: UploadVendorImageOptions): Promise<UploadedVendorImage> {
  validateUploadInput(ownerId, vendorId, image);

  const storagePath = createVendorStoragePath(
    ownerId.trim(),
    vendorId.trim(),
    folder,
    image,
  );

  const storageReference = ref(firebaseStorage, storagePath);

  const uploadTask = uploadBytesResumable(storageReference, image.file, {
    contentType: image.file.type,
    customMetadata: {
      ownerId: ownerId.trim(),
      vendorId: vendorId.trim(),
      imagePurpose: image.purpose,
    },
  });

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          snapshot.totalBytes > 0
            ? Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
              )
            : 0;

        onProgress?.(progress);
      },
      (error) => {
        reject(error);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

          resolve({
            id: image.id,
            downloadUrl,
            storagePath,
            order: image.order,
          });
        } catch (error) {
          reject(error);
        }
      },
    );
  });
}

export async function uploadVendorLogo(
  ownerId: string,
  vendorId: string,
  image: UploadedImage,
  onProgress?: (progress: number) => void,
): Promise<UploadedVendorImage> {
  return uploadVendorImage({
    ownerId,
    vendorId,
    image,
    folder: "logo",
    onProgress,
  });
}

export async function uploadVendorCover(
  ownerId: string,
  vendorId: string,
  image: UploadedImage,
  onProgress?: (progress: number) => void,
): Promise<UploadedVendorImage> {
  return uploadVendorImage({
    ownerId,
    vendorId,
    image,
    folder: "cover",
    onProgress,
  });
}

export async function uploadVendorGalleryImages(
  ownerId: string,
  vendorId: string,
  images: UploadedImage[],
  onImageProgress?: (imageId: string, progress: number) => void,
): Promise<UploadedVendorImage[]> {
  const orderedImages = [...images].sort(
    (firstImage, secondImage) =>
      (firstImage.order ?? 0) - (secondImage.order ?? 0),
  );

  const uploads = orderedImages.map((image) =>
    uploadVendorImage({
      ownerId,
      vendorId,
      image,
      folder: "gallery",
      onProgress: (progress) => {
        onImageProgress?.(image.id, progress);
      },
    }),
  );

  return Promise.all(uploads);
}

export async function deleteVendorImage(storagePath: string): Promise<void> {
  const normalizedPath = storagePath.trim();

  if (!normalizedPath) {
    throw new Error("A storage path is required to delete an image.");
  }

  const storageReference = ref(firebaseStorage, normalizedPath);

  await deleteObject(storageReference);
}
