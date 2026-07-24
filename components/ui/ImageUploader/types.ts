export type ImageUploadStatus =
  | "ready"
  | "processing"
  | "uploading"
  | "success"
  | "error";

export type ImagePurpose = "logo" | "cover" | "gallery";

export interface UploadedImage {
  id: string;
  file: File;
  previewUrl: string;

  purpose: ImagePurpose;
  status: ImageUploadStatus;

  progress: number;
  error: string | null;

  width?: number;
  height?: number;

  storagePath?: string;
  downloadUrl?: string;

  order?: number;
}

export interface ImageValidationOptions {
  acceptedTypes: string[];
  maxFileSizeBytes: number;
  minimumWidth?: number;
  minimumHeight?: number;
  maximumWidth?: number;
  maximumHeight?: number;
}

export interface ImageValidationResult {
  valid: boolean;
  error: string | null;
}
