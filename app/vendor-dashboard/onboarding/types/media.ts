import type { UploadedImage } from "@/components/ui/ImageUploader";

export interface VendorMedia {
  logo: UploadedImage | null;
  cover: UploadedImage | null;
  galleryFiles: UploadedImage[];
}

export type { UploadedImage };
