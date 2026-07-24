"use client";

import { Field, FieldGroup, Input } from "@/components/ui";

export interface ContactStepData {
  phone: string;
  email: string;
  website: string;
}

interface ContactStepProps {
  value: ContactStepData;
  onChange: (value: ContactStepData) => void;
}

export default function ContactStep({ value, onChange }: ContactStepProps) {
  function updateField(field: keyof ContactStepData, fieldValue: string) {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  }

  return (
    <FieldGroup
      title="Contact information"
      description="Add the public contact details customers can use to reach the business."
    >
      <Field
        label="Business phone"
        htmlFor="phone"
        helperText="Use the phone number customers should call or text."
      >
        <Input
          id="phone"
          type="tel"
          value={value.phone}
          onChange={(event) => updateField("phone", event.target.value)}
          placeholder="(915) 555-1234"
          autoComplete="tel"
        />
      </Field>

      <Field
        label="Business email"
        htmlFor="email"
        helperText="Use an email address that is regularly monitored."
      >
        <Input
          id="email"
          type="email"
          value={value.email}
          onChange={(event) => updateField("email", event.target.value)}
          placeholder="contact@business.com"
          autoComplete="email"
        />
      </Field>

      <Field
        label="Website (optional)"
        htmlFor="website"
        helperText="Add the full website address, including https://."
      >
        <Input
          id="website"
          type="url"
          value={value.website}
          onChange={(event) => updateField("website", event.target.value)}
          placeholder="https://yourbusiness.com"
          autoComplete="url"
        />
      </Field>
    </FieldGroup>
  );
}
