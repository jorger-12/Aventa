"use client";

import { ImageUploader } from "@/components/ui/ImageUploader";

import type { UploadedImage } from "../types/media";

import styles from "../VendorOnboarding.module.css";

export interface MediaStepData {
  logo: UploadedImage | null;
  cover: UploadedImage | null;
  galleryFiles: UploadedImage[];
}

interface MediaStepProps {
  value: MediaStepData;
  onChange: (value: MediaStepData) => void;
}

export default function MediaStep({ value, onChange }: MediaStepProps) {
  return (
    <div className={styles.mediaForm}>
      <section className={styles.mediaSection}>
        <ImageUploader
          purpose="logo"
          label="Business logo"
          description="Upload the main logo customers will see on your profile."
          value={value.logo}
          onChange={(logo) => {
            onChange({
              ...value,
              logo,
            });
          }}
        />
      </section>

      <section className={styles.mediaSection}>
        <ImageUploader
          purpose="cover"
          label="Cover image"
          description="Choose a wide image that represents your business."
          value={value.cover}
          onChange={(cover) => {
            onChange({
              ...value,
              cover,
            });
          }}
        />
      </section>

      <section className={styles.mediaSection}>
        <ImageUploader
          purpose="gallery"
          label="Business gallery"
          description="Add photos of your work, products, venue, or services."
          multiple
          maxImages={25}
          value={value.galleryFiles}
          onChange={(galleryFiles) => {
            onChange({
              ...value,
              galleryFiles,
            });
          }}
        />
      </section>
    </div>
  );
}
