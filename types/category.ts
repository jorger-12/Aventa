export interface VendorService {
  id: string;
  name: string;
  slug: string;

  description?: string;

  active: boolean;
}

export interface VendorSubcategory {
  id: string;
  name: string;
  slug: string;

  description?: string;

  services: VendorService[];

  active: boolean;
  sortOrder: number;
}

export interface VendorCategory {
  id: string;
  name: string;
  slug: string;

  description?: string;
  icon?: string;

  featuredServiceIds: string[];

  subcategories: VendorSubcategory[];

  active: boolean;
  sortOrder: number;
}

export interface VendorSubcategoryContext {
  category: VendorCategory;
  subcategory: VendorSubcategory;
}

export interface VendorServiceContext extends VendorSubcategoryContext {
  service: VendorService;
}
