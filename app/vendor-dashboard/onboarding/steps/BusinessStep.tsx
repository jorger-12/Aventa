"use client";

import styles from "../VendorOnboarding.module.css";

import {
  CharacterCounter,
  Field,
  FieldGroup,
  Input,
  Textarea,
} from "@/components/ui";

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
    <FieldGroup
      title="Business Information"
      description="Tell customers who you are and what you do."
    >
      <Field
        label="Business name"
        htmlFor="businessName"
        required
        helperText="Enter the public business name customers will see."
      >
        <Input
          id="businessName"
          value={value.businessName}
          onChange={(event) => updateField("businessName", event.target.value)}
          placeholder="Aventa Events"
          autoComplete="organization"
          maxLength={80}
          required
        />

        <CharacterCounter current={value.businessName.length} max={80} />
      </Field>

      <Field
        label="Short description"
        htmlFor="shortDescription"
        required
        helperText="Write one short sentence that summarizes the business."
      >
        <Input
          id="shortDescription"
          value={value.shortDescription}
          onChange={(event) =>
            updateField("shortDescription", event.target.value)
          }
          placeholder="A short sentence customers can quickly understand."
          maxLength={120}
          required
        />

        <CharacterCounter current={value.shortDescription.length} max={120} />
      </Field>

      <Field
        label="Business description"
        htmlFor="description"
        required
        helperText="Explain the services, experience, specialties, and qualities that make the business different."
      >
        <Textarea
          id="description"
          value={value.description}
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="Describe your services, experience, specialties, and what makes your business unique."
          maxLength={1000}
          rows={7}
          required
        />

        <CharacterCounter current={value.description.length} max={1000} />
      </Field>
    </FieldGroup>
  );
}
