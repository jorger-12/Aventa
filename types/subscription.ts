export type SubscriptionPlan =
  | "free"
  | "starter"
  | "professional"
  | "premium";

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "expired";

export interface SubscriptionLimits {
  maxVendorProfiles: number;
  maxLocationsPerProfile: number;

  maxProfileGalleryImages: number;
  maxImagesPerLocation: number;

  maxCategories: number;
  maxServices: number;
}

export interface SubscriptionFeatures {
  featuredPlacement: boolean;
  analytics: boolean;
  bookingCalendar: boolean;
  customUrl: boolean;
  verifiedBadge: boolean;
  socialLinks: boolean;
  prioritySupport: boolean;
}

export interface SubscriptionPlanConfig {
  name: string;
  description: string;
  monthlyPrice: number;

  limits: SubscriptionLimits;
  features: SubscriptionFeatures;
}

export const SUBSCRIPTION_PLANS: Record<
  SubscriptionPlan,
  SubscriptionPlanConfig
> = {
  free: {
    name: "Free",
    description: "A basic listing for vendors getting started.",
    monthlyPrice: 0,

    limits: {
      maxVendorProfiles: 1,
      maxLocationsPerProfile: 1,
      maxProfileGalleryImages: 5,
      maxImagesPerLocation: 5,
      maxCategories: 2,
      maxServices: 5,
    },

    features: {
      featuredPlacement: false,
      analytics: false,
      bookingCalendar: false,
      customUrl: false,
      verifiedBadge: false,
      socialLinks: true,
      prioritySupport: false,
    },
  },

  starter: {
    name: "Starter",
    description: "More visibility and space for growing vendors.",
    monthlyPrice: 0,

    limits: {
      maxVendorProfiles: 1,
      maxLocationsPerProfile: 2,
      maxProfileGalleryImages: 12,
      maxImagesPerLocation: 10,
      maxCategories: 4,
      maxServices: 12,
    },

    features: {
      featuredPlacement: false,
      analytics: true,
      bookingCalendar: false,
      customUrl: false,
      verifiedBadge: false,
      socialLinks: true,
      prioritySupport: false,
    },
  },

  professional: {
    name: "Professional",
    description: "Advanced tools for established event businesses.",
    monthlyPrice: 0,

    limits: {
      maxVendorProfiles: 1,
      maxLocationsPerProfile: 5,
      maxProfileGalleryImages: 25,
      maxImagesPerLocation: 20,
      maxCategories: 8,
      maxServices: 30,
    },

    features: {
      featuredPlacement: true,
      analytics: true,
      bookingCalendar: true,
      customUrl: true,
      verifiedBadge: true,
      socialLinks: true,
      prioritySupport: false,
    },
  },

  premium: {
    name: "Premium",
    description: "Maximum exposure and support for larger businesses.",
    monthlyPrice: 0,

    limits: {
      maxVendorProfiles: 3,
      maxLocationsPerProfile: 10,
      maxProfileGalleryImages: 50,
      maxImagesPerLocation: 35,
      maxCategories: 15,
      maxServices: 75,
    },

    features: {
      featuredPlacement: true,
      analytics: true,
      bookingCalendar: true,
      customUrl: true,
      verifiedBadge: true,
      socialLinks: true,
      prioritySupport: true,
    },
  },
};