import { firebaseAuth } from "@/lib/firebase/client";

import { createVendor } from "./vendor.service";

import type { VendorOnboardingData } from "@/app/vendor-dashboard/onboarding/reducers/vendorProfileReducer";

import { updateVendor } from "./vendor.service";

import {
  uploadVendorLogo,
  uploadVendorCover,
  uploadVendorGalleryImages,
} from "./storage.service";

export async function submitVendorOnboarding(
  vendorProfile: VendorOnboardingData,
) {
  const user = firebaseAuth.currentUser;

  if (!user) {
    throw new Error("User must be logged in.");
  }

  const vendor = await createVendor({
    ownerId: user.uid,

    businessName: vendorProfile.businessName,

    serviceCategories: vendorProfile.serviceCategories,

    shortDescription: vendorProfile.shortDescription,
    description: vendorProfile.description,

    phone: vendorProfile.phone,
    email: vendorProfile.email,
    website: vendorProfile.website,

    facebook: vendorProfile.facebook,
    instagram: vendorProfile.instagram,
    tiktok: vendorProfile.tiktok,

    locations: [
      {
        id: crypto.randomUUID(),

        name: vendorProfile.location.locationName,

        slug: "",

        address: {
          street: vendorProfile.location.street,
          city: vendorProfile.location.city,
          state: vendorProfile.location.state,
          zipCode: vendorProfile.location.zipCode,
          country: vendorProfile.location.country,
        },

        phone: vendorProfile.location.phone,
        email: vendorProfile.location.email,

        media: {
          logoUrl: undefined,
          coverImageUrl: undefined,
          galleryImages: [],
        },

        amenities: [],

        rating: 0,
        reviewCount: 0,

        active: true,

        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],

    media: {
      logoUrl: undefined,
      coverImageUrl: undefined,
      galleryImages: [],
    },

    subscriptionPlan: "free",
    subscriptionStatus: "active",
  });

  const uploadedMedia = {
    logoUrl: undefined as string | undefined,
    coverImageUrl: undefined as string | undefined,
    galleryImages: [] as string[],
  };

  try {
    if (vendorProfile.media.logo) {
      const logo = await uploadVendorLogo(
        user.uid,
        vendor.id,
        vendorProfile.media.logo,
      );

      uploadedMedia.logoUrl = logo.downloadUrl;
    }

    if (vendorProfile.media.cover) {
      const cover = await uploadVendorCover(
        user.uid,
        vendor.id,
        vendorProfile.media.cover,
      );

      uploadedMedia.coverImageUrl = cover.downloadUrl;
    }

    if (vendorProfile.media.galleryFiles.length > 0) {
      const gallery = await uploadVendorGalleryImages(
        user.uid,
        vendor.id,
        vendorProfile.media.galleryFiles,
      );

      uploadedMedia.galleryImages = gallery.map((image) => image.downloadUrl);
    }

    await updateVendor(vendor.id, {
      media: uploadedMedia,
    });
  } catch (error) {
    console.error("Vendor media upload failed:", error);
    throw error;
  }

  return vendor;
}
