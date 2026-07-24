"use client";

import { useState } from "react";

import {
  Checkbox,
  Field,
  FieldGroup,
  FormMessage,
  Select,
} from "@/components/ui";

import { VENDOR_CATEGORIES } from "@/data/categories";

export type ServicesStepData = {
  primaryCategoryId: string;
  businessTypeIds: string[];
};

type ServicesStepProps = {
  value: ServicesStepData;
  onChange: (value: ServicesStepData) => void;
};

export default function ServicesStep({ value, onChange }: ServicesStepProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    value.primaryCategoryId || VENDOR_CATEGORIES[0]?.id || "",
  );

  const selectedCategory = VENDOR_CATEGORIES.find(
    (category) => category.id === selectedCategoryId,
  );

  function updatePrimaryCategory(categoryId: string) {
    setSelectedCategoryId(categoryId);

    onChange({
      ...value,
      primaryCategoryId: categoryId,
      businessTypeIds: [],
    });
  }

  function toggleBusinessType(businessTypeId: string) {
    const isSelected = value.businessTypeIds.includes(businessTypeId);

    const nextBusinessTypeIds = isSelected
      ? value.businessTypeIds.filter((id) => id !== businessTypeId)
      : [...value.businessTypeIds, businessTypeId];

    onChange({
      ...value,
      businessTypeIds: nextBusinessTypeIds,
    });
  }

  return (
    <>
      <FieldGroup
        title="Business category"
        description="Choose the category that best represents the business."
      >
        <Field
          label="Primary category"
          htmlFor="business-category"
          required
          helperText="This category determines where the business appears throughout Aventa."
        >
          <Select
            id="business-category"
            value={selectedCategoryId}
            onChange={(event) => updatePrimaryCategory(event.target.value)}
            required
          >
            <option value="">Select a business category</option>

            {VENDOR_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </Field>
      </FieldGroup>

      <FieldGroup
        title="Business types"
        description="Select every service type that accurately describes the business."
      >
        {!selectedCategory && (
          <FormMessage type="helper">
            Select a business category to view its available business types.
          </FormMessage>
        )}

        {selectedCategory && (
          <>
            <FormMessage type="helper">
              {value.businessTypeIds.length} business
              {value.businessTypeIds.length === 1 ? " type" : " types"} selected
            </FormMessage>

            {selectedCategory.businessTypes.map((businessType) => (
              <Checkbox
                key={businessType.id}
                id={`business-type-${businessType.id}`}
                checked={value.businessTypeIds.includes(businessType.id)}
                onChange={() => toggleBusinessType(businessType.id)}
                label={businessType.name}
              />
            ))}
          </>
        )}
      </FieldGroup>
    </>
  );
}
