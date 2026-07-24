"use client";

import { Field, FieldGroup, Input } from "@/components/ui";

export interface SocialStepData {
  facebook: string;
  instagram: string;
  tiktok: string;
}

interface SocialStepProps {
  value: SocialStepData;
  onChange: (value: SocialStepData) => void;
}

export default function SocialStep({ value, onChange }: SocialStepProps) {
  function updateField(field: keyof SocialStepData, fieldValue: string) {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  }

  return (
    <FieldGroup
      title="Social media"
      description="Add your public social media profiles to help customers learn more about your business."
    >
      <Field
        label="Facebook (optional)"
        htmlFor="facebook"
        helperText="Paste the full URL to your Facebook business page."
      >
        <Input
          id="facebook"
          type="url"
          value={value.facebook}
          onChange={(event) => updateField("facebook", event.target.value)}
          placeholder="https://facebook.com/yourbusiness"
          autoComplete="url"
        />
      </Field>

      <Field
        label="Instagram (optional)"
        htmlFor="instagram"
        helperText="Paste the full URL to your Instagram profile."
      >
        <Input
          id="instagram"
          type="url"
          value={value.instagram}
          onChange={(event) => updateField("instagram", event.target.value)}
          placeholder="https://instagram.com/yourbusiness"
          autoComplete="url"
        />
      </Field>

      <Field
        label="TikTok (optional)"
        htmlFor="tiktok"
        helperText="Paste the full URL to your TikTok profile."
      >
        <Input
          id="tiktok"
          type="url"
          value={value.tiktok}
          onChange={(event) => updateField("tiktok", event.target.value)}
          placeholder="https://tiktok.com/@yourbusiness"
          autoComplete="url"
        />
      </Field>
    </FieldGroup>
  );
}
