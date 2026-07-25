import type { VendorOnboardingData } from "../reducers/vendorProfileReducer";

import styles from "./ReviewStep.module.css";

import SectionCard from "@/components/ui/SectionCard";

import { VENDOR_CATEGORIES } from "@/data/categories";

interface ReviewStepProps {
  value: VendorOnboardingData;
  onEditStep: (
    step: "business" | "services" | "contact" | "social" | "location" | "media",
  ) => void;
}
export default function ReviewStep({ value, onEditStep }: ReviewStepProps) {
  return (
    <div>
      <SectionCard title="Business" onEdit={() => onEditStep("business")}>
        <div className={styles.row}>
          <span>Name</span>
          <span>{value.businessName || "—"}</span>
        </div>

        <div className={styles.row}>
          <span>Short Description</span>
          <span>{value.shortDescription || "—"}</span>
        </div>

        <div className={styles.row}>
          <span>Description</span>
          <span>{value.description || "—"}</span>
        </div>
      </SectionCard>

      <SectionCard title="Services" onEdit={() => onEditStep("services")}>
        {value.serviceCategories.length === 0 ? (
          <div className={styles.row}>
            <span>Services</span>
            <span>—</span>
          </div>
        ) : (
          value.serviceCategories.map((service, index) => {
            const category = VENDOR_CATEGORIES.find(
              (item) => item.id === service.categoryId,
            );

            const businessTypeNames = service.businessTypeIds
              .map((businessTypeId) =>
                category?.businessTypes.find(
                  (businessType) => businessType.id === businessTypeId,
                ),
              )
              .filter(Boolean)
              .map((businessType) => businessType!.name);

            return (
              <div
                key={`${service.categoryId}-${index}`}
                style={{
                  paddingBottom:
                    index < value.serviceCategories.length - 1 ? "1rem" : 0,
                  marginBottom:
                    index < value.serviceCategories.length - 1 ? "1rem" : 0,
                  borderBottom:
                    index < value.serviceCategories.length - 1
                      ? "1px solid #ece7dc"
                      : "none",
                }}
              >
                <div className={styles.row}>
                  <span>
                    {index === 0 ? "Primary Category" : `Category ${index + 1}`}
                  </span>

                  <span>{category?.name || "—"}</span>
                </div>

                <div className={styles.row}>
                  <span>Business Types</span>

                  <span>
                    {businessTypeNames.length > 0
                      ? businessTypeNames.join(", ")
                      : "—"}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </SectionCard>

      <SectionCard title="Contact" onEdit={() => onEditStep("contact")}>
        <div className={styles.row}>
          <span>Phone</span>
          <span>{value.phone || "—"}</span>
        </div>

        <div className={styles.row}>
          <span>Email</span>
          <span>{value.email || "—"}</span>
        </div>

        <div className={styles.row}>
          <span>Website</span>
          <span>{value.website || "—"}</span>
        </div>
      </SectionCard>

      <SectionCard title="Social" onEdit={() => onEditStep("social")}>
        <div className={styles.row}>
          <span>Facebook</span>
          <span>{value.facebook || "—"}</span>
        </div>

        <div className={styles.row}>
          <span>Instagram</span>
          <span>{value.instagram || "—"}</span>
        </div>

        <div className={styles.row}>
          <span>TikTok</span>
          <span>{value.tiktok || "—"}</span>
        </div>
      </SectionCard>

      <SectionCard title="Location" onEdit={() => onEditStep("location")}>
        <div className={styles.row}>
          <span>Location Name</span>
          <span>{value.location.locationName || "—"}</span>
        </div>

        <div className={styles.row}>
          <span>Street</span>
          <span>{value.location.street || "—"}</span>
        </div>

        <div className={styles.row}>
          <span>City</span>
          <span>{value.location.city || "—"}</span>
        </div>

        <div className={styles.row}>
          <span>State</span>
          <span>{value.location.state || "—"}</span>
        </div>

        <div className={styles.row}>
          <span>ZIP Code</span>
          <span>{value.location.zipCode || "—"}</span>
        </div>

        <div className={styles.row}>
          <span>Country</span>
          <span>{value.location.country || "—"}</span>
        </div>

        <div className={styles.row}>
          <span>Location Phone</span>
          <span>{value.location.phone || "—"}</span>
        </div>

        <div className={styles.row}>
          <span>Location Email</span>
          <span>{value.location.email || "—"}</span>
        </div>

        <div className={styles.row}>
          <span>Serves Customer Location</span>
          <span>{value.location.servesAtCustomerLocation ? "Yes" : "No"}</span>
        </div>

        <div className={styles.row}>
          <span>Service Radius</span>
          <span>{value.location.serviceRadiusMiles} miles</span>
        </div>
      </SectionCard>

      <SectionCard title="Media" onEdit={() => onEditStep("media")}>
        <div className={styles.mediaReviewSection}>
          <div className={styles.mediaReviewHeader}>
            <span>Business Logo</span>
          </div>

          {value.media.logo ? (
            <img
              src={value.media.logo.previewUrl}
              alt="Business logo preview"
              className={styles.reviewLogo}
            />
          ) : (
            <p className={styles.emptyMediaMessage}>No logo uploaded.</p>
          )}
        </div>

        <div className={styles.mediaReviewSection}>
          <div className={styles.mediaReviewHeader}>
            <span>Cover Image</span>
          </div>

          {value.media.cover ? (
            <img
              src={value.media.cover.previewUrl}
              alt="Cover image preview"
              className={styles.reviewCover}
            />
          ) : (
            <p className={styles.emptyMediaMessage}>No cover image uploaded.</p>
          )}
        </div>

        <div className={styles.mediaReviewSection}>
          <div className={styles.mediaReviewHeader}>
            <span>Gallery</span>

            <span className={styles.galleryCount}>
              {value.media.galleryFiles.length}{" "}
              {value.media.galleryFiles.length === 1 ? "image" : "images"}
            </span>
          </div>

          {value.media.galleryFiles.length > 0 ? (
            <div className={styles.reviewGalleryGrid}>
              {value.media.galleryFiles
                .slice()
                .sort((firstImage, secondImage) => {
                  return (firstImage.order ?? 0) - (secondImage.order ?? 0);
                })
                .map((image, index) => (
                  <div key={image.id} className={styles.reviewGalleryItem}>
                    <img
                      src={image.previewUrl}
                      alt={`Gallery image ${index + 1}: ${image.file.name}`}
                      className={styles.reviewGalleryImage}
                    />
                  </div>
                ))}
            </div>
          ) : (
            <p className={styles.emptyMediaMessage}>
              No gallery images uploaded.
            </p>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
