"use client";

import {
  Checkbox,
  Field,
  FieldGroup,
  FormMessage,
  Select,
} from "@/components/ui";

import { VENDOR_CATEGORIES } from "@/data/categories";

export type ServiceCategorySelection = {
  categoryId: string;
  businessTypeIds: string[];
};

export type ServicesStepData = {
  serviceCategories: ServiceCategorySelection[];
};

type ServicesStepProps = {
  value: ServicesStepData;
  onChange: (value: ServicesStepData) => void;
};

const emptyCategory: ServiceCategorySelection = {
  categoryId: "",
  businessTypeIds: [],
};

export default function ServicesStep({ value, onChange }: ServicesStepProps) {
  const serviceCategories =
    value.serviceCategories.length > 0
      ? value.serviceCategories
      : [emptyCategory];

  function updateCategory(index: number, categoryId: string) {
    const selectedCategory = VENDOR_CATEGORIES.find(
      (category) => category.id === categoryId,
    );

    const validBusinessTypeIds = new Set(
      selectedCategory?.businessTypes.map((businessType) => businessType.id) ??
        [],
    );

    const nextServiceCategories = serviceCategories.map(
      (categorySelection, categoryIndex) => {
        if (categoryIndex !== index) {
          return categorySelection;
        }

        return {
          categoryId,
          businessTypeIds: categorySelection.businessTypeIds.filter((id) =>
            validBusinessTypeIds.has(id),
          ),
        };
      },
    );

    onChange({
      ...value,
      serviceCategories: nextServiceCategories,
    });
  }

  function toggleBusinessType(categoryIndex: number, businessTypeId: string) {
    const nextServiceCategories = serviceCategories.map(
      (categorySelection, index) => {
        if (index !== categoryIndex) {
          return categorySelection;
        }

        const isSelected =
          categorySelection.businessTypeIds.includes(businessTypeId);

        return {
          ...categorySelection,
          businessTypeIds: isSelected
            ? categorySelection.businessTypeIds.filter(
                (id) => id !== businessTypeId,
              )
            : [...categorySelection.businessTypeIds, businessTypeId],
        };
      },
    );

    onChange({
      ...value,
      serviceCategories: nextServiceCategories,
    });
  }

  function clearBusinessTypes(categoryIndex: number) {
    const nextServiceCategories = serviceCategories.map(
      (categorySelection, index) =>
        index === categoryIndex
          ? {
              ...categorySelection,
              businessTypeIds: [],
            }
          : categorySelection,
    );

    onChange({
      ...value,
      serviceCategories: nextServiceCategories,
    });
  }

  function addCategory() {
    const hasIncompleteCategory = serviceCategories.some(
      (categorySelection) => !categorySelection.categoryId,
    );

    if (hasIncompleteCategory) {
      return;
    }

    onChange({
      ...value,
      serviceCategories: [...serviceCategories, { ...emptyCategory }],
    });
  }

  function removeCategory(categoryIndex: number) {
    const nextServiceCategories = serviceCategories.filter(
      (_, index) => index !== categoryIndex,
    );

    onChange({
      ...value,
      serviceCategories:
        nextServiceCategories.length > 0
          ? nextServiceCategories
          : [{ ...emptyCategory }],
    });
  }

  function isCategoryAlreadySelected(
    categoryId: string,
    currentCategoryIndex: number,
  ) {
    return serviceCategories.some(
      (categorySelection, index) =>
        index !== currentCategoryIndex &&
        categorySelection.categoryId === categoryId,
    );
  }

  const canAddAnotherCategory =
    serviceCategories.every(
      (categorySelection) => categorySelection.categoryId,
    ) && serviceCategories.length < VENDOR_CATEGORIES.length;

  return (
    <FieldGroup
      title="Services"
      description="Select every category and business type that accurately represents the business."
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        {serviceCategories.map((categorySelection, categoryIndex) => {
          const selectedCategory = VENDOR_CATEGORIES.find(
            (category) => category.id === categorySelection.categoryId,
          );

          const selectedCount = categorySelection.businessTypeIds.length;

          return (
            <section
              key={`${categoryIndex}-${categorySelection.categoryId}`}
              style={{
                border: "1px solid #e8e2d7",
                borderRadius: "14px",
                padding: "1.25rem",
                background: "#ffffff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "1rem",
                      fontWeight: 600,
                    }}
                  >
                    {categoryIndex === 0
                      ? "Primary category"
                      : `Additional category ${categoryIndex + 1}`}
                  </h3>

                  <p
                    style={{
                      margin: "0.3rem 0 0",
                      color: "#6b7280",
                      fontSize: "0.875rem",
                    }}
                  >
                    {categoryIndex === 0
                      ? "This is the business's main category."
                      : "This category will also appear on the vendor profile."}
                  </p>
                </div>

                {categoryIndex > 0 && (
                  <button
                    type="button"
                    onClick={() => removeCategory(categoryIndex)}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "#9f2d2d",
                      cursor: "pointer",
                      fontWeight: 600,
                      padding: "0.4rem",
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>

              <Field
                label={
                  categoryIndex === 0 ? "Primary category" : "Business category"
                }
                htmlFor={`business-category-${categoryIndex}`}
                required
              >
                <Select
                  id={`business-category-${categoryIndex}`}
                  value={categorySelection.categoryId}
                  onChange={(event) =>
                    updateCategory(categoryIndex, event.target.value)
                  }
                  required
                >
                  <option value="">Select a business category</option>

                  {VENDOR_CATEGORIES.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                      disabled={isCategoryAlreadySelected(
                        category.id,
                        categoryIndex,
                      )}
                    >
                      {category.name}
                    </option>
                  ))}
                </Select>
              </Field>

              {!selectedCategory && (
                <FormMessage type="helper">
                  Select a category to view its available business types.
                </FormMessage>
              )}

              {selectedCategory && (
                <div style={{ marginTop: "1.25rem" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "0.75rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <FormMessage type="helper">
                      {selectedCount} business
                      {selectedCount === 1 ? " type" : " types"} selected
                    </FormMessage>

                    {selectedCount > 0 && (
                      <button
                        type="button"
                        onClick={() => clearBusinessTypes(categoryIndex)}
                        style={{
                          border: "none",
                          background: "transparent",
                          color: "#8a6a2f",
                          cursor: "pointer",
                          fontWeight: 600,
                          padding: "0.4rem",
                        }}
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(210px, 1fr))",
                      gap: "0.85rem 1rem",
                    }}
                  >
                    {selectedCategory.businessTypes.map((businessType) => (
                      <Checkbox
                        key={businessType.id}
                        id={`category-${categoryIndex}-business-type-${businessType.id}`}
                        checked={categorySelection.businessTypeIds.includes(
                          businessType.id,
                        )}
                        onChange={() =>
                          toggleBusinessType(categoryIndex, businessType.id)
                        }
                        label={businessType.name}
                      />
                    ))}
                  </div>
                </div>
              )}
            </section>
          );
        })}

        <button
          type="button"
          onClick={addCategory}
          disabled={!canAddAnotherCategory}
          style={{
            width: "100%",
            border: "1px dashed #b99757",
            borderRadius: "12px",
            background: canAddAnotherCategory ? "#fffdf8" : "#f5f5f5",
            color: canAddAnotherCategory ? "#7a5a23" : "#9ca3af",
            cursor: canAddAnotherCategory ? "pointer" : "not-allowed",
            padding: "0.95rem 1rem",
            fontWeight: 600,
          }}
        >
          + Add another category
        </button>
      </div>
    </FieldGroup>
  );
}
