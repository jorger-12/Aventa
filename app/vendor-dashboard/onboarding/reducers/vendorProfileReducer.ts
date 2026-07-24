import type { LocationStepData } from "../steps/LocationStep";

import type { MediaStepData } from "../steps/MediaStep";

export interface VendorOnboardingData {
  businessName: string;
  shortDescription: string;
  description: string;

  primaryCategoryId: string;
  businessTypeIds: string[];

  phone: string;
  email: string;
  website: string;

  facebook: string;
  instagram: string;
  tiktok: string;

  location: LocationStepData;

  media: MediaStepData;
}

export const initialVendorProfile: VendorOnboardingData = {
  businessName: "",
  shortDescription: "",
  description: "",

  primaryCategoryId: "",
  businessTypeIds: [],

  phone: "",
  email: "",
  website: "",

  facebook: "",
  instagram: "",
  tiktok: "",

  location: {
    locationName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",

    phone: "",
    email: "",

    servesAtCustomerLocation: false,
    serviceRadiusMiles: 25,

    latitude: null,
    longitude: null,
    placeId: "",
  },

  media: {
    logo: null,
    cover: null,
    galleryFiles: [],
  },
};
