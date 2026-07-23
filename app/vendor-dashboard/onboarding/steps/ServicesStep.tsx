import { useState } from "react";
import { VENDOR_CATEGORIES } from "@/data/categories";

export type ServicesStepData = {
  primaryCategory: string;
  businessTypeIds: string[];
};

type ServicesStepProps = {
  value: ServicesStepData;
  onChange: (value: ServicesStepData) => void;
};

export default function ServicesStep({ value, onChange }: ServicesStepProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    VENDOR_CATEGORIES[0]?.id ?? "",
  );

  const selectedCategory = VENDOR_CATEGORIES.find(
    (category) => category.id === selectedCategoryId,
  );

  const toggleBusinessType = (businessTypeId: string) => {
    const isSelected = value.businessTypeIds.includes(businessTypeId);

    const nextBusinessTypeIds = isSelected
      ? value.businessTypeIds.filter((id) => id !== businessTypeId)
      : [...value.businessTypeIds, businessTypeId];

    onChange({
      ...value,
      businessTypeIds: nextBusinessTypeIds,
    });
  };

  return (
    <div>
      <p>Selected business types: {value.businessTypeIds.length}</p>

      <label htmlFor="business-category">Business Category</label>

      <select
        id="business-category"
        value={selectedCategoryId}
        onChange={(event) => setSelectedCategoryId(event.target.value)}
      >
        {VENDOR_CATEGORIES.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      {selectedCategory && (
        <div>
          <h3>{selectedCategory.name}</h3>

          {selectedCategory.businessTypes.map((businessType) => (
            <label key={businessType.id}>
              <input
                type="checkbox"
                checked={value.businessTypeIds.includes(businessType.id)}
                onChange={() => toggleBusinessType(businessType.id)}
              />

              {businessType.name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
