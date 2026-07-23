"use client";

import styles from "../VendorOnboarding.module.css";

export interface BusinessStepData {
  businessName: string;
  shortDescription: string;
  description: string;
}

interface BusinessStepProps {
  value: BusinessStepData;
  onChange: (value: BusinessStepData) => void;
}

export default function BusinessStep({ value, onChange }: BusinessStepProps) {
  function updateField(field: keyof BusinessStepData, fieldValue: string) {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  }

  return (
    <div className={styles.formSection}>
      <div className={styles.field}>
        <label htmlFor="businessName">
          Business name
          <span aria-hidden="true">*</span>
        </label>

        <input
          id="businessName"
          name="businessName"
          type="text"
          maxLength={80}
          value={value.businessName}
          placeholder="Example: Luna Event Photography"
          onChange={(event) => updateField("businessName", event.target.value)}
        />

        <p className={styles.fieldHint}>
          {value.businessName.length}/80 characters
        </p>
      </div>

      <div className={styles.field}>
        <label htmlFor="shortDescription">
          Short description
          <span aria-hidden="true">*</span>
        </label>

        <input
          id="shortDescription"
          name="shortDescription"
          type="text"
          maxLength={120}
          value={value.shortDescription}
          placeholder="A short sentence customers will see on your vendor card."
          onChange={(event) =>
            updateField("shortDescription", event.target.value)
          }
        />

        <p className={styles.fieldHint}>
          {value.shortDescription.length}/120 characters
        </p>
      </div>

      <div className={styles.field}>
        <label htmlFor="description">
          Business description
          <span aria-hidden="true">*</span>
        </label>

        <textarea
          id="description"
          name="description"
          rows={7}
          maxLength={1000}
          value={value.description}
          placeholder="Describe your services, experience, specialties, and what makes your business different."
          onChange={(event) => updateField("description", event.target.value)}
        />

        <p className={styles.fieldHint}>
          {value.description.length}/1000 characters
        </p>
      </div>
    </div>
  );
}
