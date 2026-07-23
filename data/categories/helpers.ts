import { VENDOR_CATEGORIES } from "./index";
import type { BusinessCategory, BusinessType } from "./types";

export function getCategoryById(
  categoryId: string,
): BusinessCategory | undefined {
  return VENDOR_CATEGORIES.find((category) => category.id === categoryId);
}

export function getBusinessTypeById(
  businessTypeId: string,
): BusinessType | undefined {
  for (const category of VENDOR_CATEGORIES) {
    const businessType = category.businessTypes.find(
      (item) => item.id === businessTypeId,
    );

    if (businessType) {
      return businessType;
    }
  }

  return undefined;
}

export function getCategoryIdsFromBusinessTypes(
  businessTypeIds: string[],
): string[] {
  const categoryIds = businessTypeIds
    .map((businessTypeId) => {
      const category = VENDOR_CATEGORIES.find((item) =>
        item.businessTypes.some(
          (businessType) => businessType.id === businessTypeId,
        ),
      );

      return category?.id;
    })
    .filter((categoryId): categoryId is string => Boolean(categoryId));

  return [...new Set(categoryIds)];
}
