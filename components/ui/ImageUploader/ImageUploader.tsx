"use client";

import { useState } from "react";

import ImageDropzone from "./ImageDropzone";

import {
  createUploadedImage,
  DEFAULT_ACCEPTED_IMAGE_TYPES,
  DEFAULT_MAX_IMAGE_SIZE_BYTES,
  validateImageFile,
} from "./imageValidation";

import type { ImagePurpose, UploadedImage } from "./types";

import styles from "./ImageUploader.module.css";

interface SharedImageUploaderProps {
  purpose: ImagePurpose;
  label: string;
  description?: string;
  disabled?: boolean;
  acceptedTypes?: string[];
  maxFileSizeBytes?: number;
}

interface SingleImageUploaderProps extends SharedImageUploaderProps {
  multiple?: false;
  value: UploadedImage | null;
  onChange: (image: UploadedImage | null) => void;
  maxImages?: never;
}

interface MultipleImageUploaderProps extends SharedImageUploaderProps {
  multiple: true;
  value: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  maxImages?: number;
}

export type ImageUploaderProps =
  | SingleImageUploaderProps
  | MultipleImageUploaderProps;

export default function ImageUploader(props: ImageUploaderProps) {
  const {
    purpose,
    label,
    description,
    disabled = false,
    acceptedTypes = DEFAULT_ACCEPTED_IMAGE_TYPES,
    maxFileSizeBytes = DEFAULT_MAX_IMAGE_SIZE_BYTES,
  } = props;

  const [error, setError] = useState<string | null>(null);

  const accept = acceptedTypes.join(",");

  function validateFiles(files: File[]): File[] {
    const validFiles: File[] = [];

    for (const file of files) {
      const validationResult = validateImageFile(file, {
        acceptedTypes,
        maxFileSizeBytes,
      });

      if (!validationResult.valid) {
        setError(validationResult.error);
        continue;
      }

      validFiles.push(file);
    }

    return validFiles;
  }

  function handleSingleImage(files: File[]) {
    if (props.multiple === true) {
      return;
    }

    setError(null);

    const validFiles = validateFiles(files);
    const file = validFiles[0];

    if (!file) {
      return;
    }

    if (props.value) {
      URL.revokeObjectURL(props.value.previewUrl);
    }

    const uploadedImage = createUploadedImage(file, purpose);

    props.onChange(uploadedImage);
  }

  function handleMultipleImages(files: File[]) {
    if (props.multiple !== true) {
      return;
    }

    setError(null);

    const validFiles = validateFiles(files);

    if (validFiles.length === 0) {
      return;
    }

    const maximumImages = props.maxImages ?? 25;
    const availableSlots = maximumImages - props.value.length;

    if (availableSlots <= 0) {
      setError(`You can upload up to ${maximumImages} images.`);
      return;
    }

    const filesToAdd = validFiles.slice(0, availableSlots);

    if (validFiles.length > availableSlots) {
      setError(
        `Only ${availableSlots} more ${
          availableSlots === 1 ? "image" : "images"
        } can be added.`,
      );
    }

    const startingOrder = props.value.length;

    const uploadedImages = filesToAdd.map((file, index) =>
      createUploadedImage(file, purpose, startingOrder + index),
    );

    props.onChange([...props.value, ...uploadedImages]);
  }

  function handleFilesSelected(files: File[]) {
    if (props.multiple === true) {
      handleMultipleImages(files);
      return;
    }

    handleSingleImage(files);
  }

  function removeSingleImage() {
    if (props.multiple === true) {
      return;
    }

    if (props.value) {
      URL.revokeObjectURL(props.value.previewUrl);
    }

    setError(null);
    props.onChange(null);
  }

  function removeGalleryImage(imageId: string) {
    if (props.multiple !== true) {
      return;
    }

    const imageToRemove = props.value.find((image) => image.id === imageId);

    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.previewUrl);
    }

    const remainingImages = props.value
      .filter((image) => image.id !== imageId)
      .map((image, index) => ({
        ...image,
        order: index,
      }));

    setError(null);
    props.onChange(remainingImages);
  }

  if (props.multiple === true) {
    const maximumImages = props.maxImages ?? 25;
    const hasReachedLimit = props.value.length >= maximumImages;

    return (
      <div className={styles.uploader}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.heading}>{label}</h3>

            {description && <p className={styles.description}>{description}</p>}
          </div>

          <span className={styles.imageCount}>
            {props.value.length} / {maximumImages}
          </span>
        </div>

        {props.value.length > 0 && (
          <div className={styles.galleryGrid}>
            {props.value.map((image) => (
              <div key={image.id} className={styles.galleryItem}>
                <img
                  src={image.previewUrl}
                  alt={image.file.name}
                  className={styles.galleryImage}
                />

                <button
                  type="button"
                  className={styles.removeOverlayButton}
                  aria-label={`Remove ${image.file.name}`}
                  onClick={() => removeGalleryImage(image.id)}
                >
                  ×
                </button>
              </div>
            ))}

            {!hasReachedLimit && (
              <div className={styles.galleryDropzone}>
                <ImageDropzone
                  label="Add photos"
                  description="JPG, PNG, or WebP"
                  accept={accept}
                  multiple
                  disabled={disabled}
                  onFilesSelected={handleFilesSelected}
                />
              </div>
            )}
          </div>
        )}

        {props.value.length === 0 && (
          <ImageDropzone
            label="Upload gallery photos"
            description="Add photos of your work, products, venue, or services."
            accept={accept}
            multiple
            disabled={disabled}
            onFilesSelected={handleFilesSelected}
          />
        )}

        {hasReachedLimit && (
          <p className={styles.limitMessage}>
            You have reached the maximum of {maximumImages} images.
          </p>
        )}

        {error && (
          <p className={styles.errorMessage} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={styles.uploader}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.heading}>{label}</h3>

          {description && <p className={styles.description}>{description}</p>}
        </div>
      </div>

      {props.value ? (
        <div
          className={
            purpose === "logo"
              ? styles.logoPreviewContainer
              : styles.coverPreviewContainer
          }
        >
          <img
            src={props.value.previewUrl}
            alt={`${label} preview`}
            className={
              purpose === "logo" ? styles.logoPreview : styles.coverPreview
            }
          />

          <div className={styles.previewActions}>
            <div className={styles.replaceDropzone}>
              <ImageDropzone
                label={purpose === "logo" ? "Replace logo" : "Replace cover"}
                accept={accept}
                disabled={disabled}
                onFilesSelected={handleFilesSelected}
              />
            </div>

            <button
              type="button"
              className={styles.removeButton}
              disabled={disabled}
              onClick={removeSingleImage}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          className={
            purpose === "logo" ? styles.logoDropzone : styles.coverDropzone
          }
        >
          <ImageDropzone
            label={
              purpose === "logo" ? "Upload business logo" : "Upload cover image"
            }
            description={
              purpose === "logo"
                ? "Square images work best."
                : "Wide landscape images work best."
            }
            accept={accept}
            disabled={disabled}
            onFilesSelected={handleFilesSelected}
          />
        </div>
      )}

      {error && (
        <p className={styles.errorMessage} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
