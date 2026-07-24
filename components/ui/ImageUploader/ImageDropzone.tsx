"use client";

import {
  ChangeEvent,
  DragEvent,
  KeyboardEvent,
  useId,
  useRef,
  useState,
} from "react";

import styles from "./ImageDropzone.module.css";

interface ImageDropzoneProps {
  label: string;
  description?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  onFilesSelected: (files: File[]) => void;
}

export default function ImageDropzone({
  label,
  description,
  accept = "image/jpeg,image/png,image/webp",
  multiple = false,
  disabled = false,
  onFilesSelected,
}: ImageDropzoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  function openFilePicker() {
    if (disabled) {
      return;
    }

    inputRef.current?.click();
  }

  function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (files.length > 0) {
      onFilesSelected(files);
    }

    event.target.value = "";
  }

  function handleDragEnter(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (!disabled) {
      setIsDragging(true);
    }
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (!disabled) {
      event.dataTransfer.dropEffect = "copy";
      setIsDragging(true);
    }
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();

    const nextTarget = event.relatedTarget as Node | null;

    if (nextTarget && event.currentTarget.contains(nextTarget)) {
      return;
    }

    setIsDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();

    setIsDragging(false);

    if (disabled) {
      return;
    }

    const files = Array.from(event.dataTransfer.files);

    if (files.length === 0) {
      return;
    }

    onFilesSelected(multiple ? files : files.slice(0, 1));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (disabled) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openFilePicker();
    }
  }

  const dropzoneClassName = [
    styles.dropzone,
    isDragging ? styles.dragging : "",
    disabled ? styles.disabled : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={dropzoneClassName}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-describedby={description ? `${inputId}-description` : undefined}
      onClick={openFilePicker}
      onKeyDown={handleKeyDown}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className={styles.fileInput}
        onChange={handleFileInputChange}
      />

      <span className={styles.icon} aria-hidden="true">
        +
      </span>

      <span className={styles.label}>{label}</span>

      {description && (
        <span id={`${inputId}-description`} className={styles.description}>
          {description}
        </span>
      )}

      <span className={styles.instructions}>
        Drag and drop or click to browse
      </span>
    </div>
  );
}
