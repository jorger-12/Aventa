import type { SubscriptionPlan, SubscriptionStatus } from "./subscription";

export interface VendorMedia {
  logoUrl?: string;
  coverImageUrl?: string;
  galleryImages: string[];
}

export interface VendorAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface VendorLocation {
  id: string;

  name: string;
  slug: string;

  address: VendorAddress;

  phone?: string;
  email?: string;

  media: VendorMedia;

  capacity?: number;
  priceRange?: string;

  amenities: string[];

  rating: number;
  reviewCount: number;

  active: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface Vendor {
  id: string;
  ownerId: string;

  businessName: string;
  slug: string;

  primaryCategoryId: string;
  businessCategoryIds: string[];
  businessTypeIds: string[];

  shortDescription: string;
  description: string;

  phone: string;
  email: string;
  website?: string;

  facebook?: string;
  instagram?: string;
  tiktok?: string;

  media: VendorMedia;
  locations: VendorLocation[];

  subscriptionPlan: SubscriptionPlan;
  subscriptionStatus: SubscriptionStatus;

  rating: number;
  reviewCount: number;

  profileCompleted: boolean;

  verified: boolean;
  featured: boolean;
  active: boolean;

  createdAt: Date;
  updatedAt: Date;
}
