import BusinessStep, { type BusinessStepData } from "../steps/BusinessStep";

import ServicesStep, { type ServicesStepData } from "../steps/ServicesStep";

import ContactStep, { type ContactStepData } from "../steps/ContactStep";

import SocialStep, { type SocialStepData } from "../steps/SocialStep";

import LocationStep, { type LocationStepData } from "../steps/LocationStep";

import MediaStep, { type MediaStepData } from "../steps/MediaStep";

import type { OnboardingStep } from "../types";

import styles from "../VendorOnboarding.module.css";

interface OnboardingStepRendererProps {
  currentStep: OnboardingStep;
  currentStepNumber: number;
  totalSteps: number;

  businessData: BusinessStepData;
  servicesData: ServicesStepData;
  contactData: ContactStepData;
  socialData: SocialStepData;
  locationData: LocationStepData;
  mediaData: MediaStepData;

  onBusinessChange: (value: BusinessStepData) => void;
  onServicesChange: (value: ServicesStepData) => void;
  onContactChange: (value: ContactStepData) => void;
  onSocialChange: (value: SocialStepData) => void;
  onLocationChange: (value: LocationStepData) => void;
  onMediaChange: (value: MediaStepData) => void;
}

export default function OnboardingStepRenderer({
  currentStep,
  currentStepNumber,
  totalSteps,
  businessData,
  servicesData,
  contactData,
  socialData,
  locationData,
  mediaData,
  onBusinessChange,
  onServicesChange,
  onContactChange,
  onSocialChange,
  onLocationChange,
  onMediaChange,
}: OnboardingStepRendererProps) {
  function renderStep() {
    switch (currentStep) {
      case "business":
        return (
          <>
            <h2>Business information</h2>

            <p className={styles.stepDescription}>
              Add the main details customers will see on your listing.
            </p>

            <BusinessStep value={businessData} onChange={onBusinessChange} />
          </>
        );

      case "services":
        return (
          <>
            <h2>Services</h2>

            <p className={styles.stepDescription}>
              Choose the services your business provides.
            </p>

            <ServicesStep value={servicesData} onChange={onServicesChange} />
          </>
        );

      case "contact":
        return (
          <>
            <h2>Contact information</h2>

            <p className={styles.stepDescription}>
              Add the contact details customers can use to reach your business.
            </p>

            <ContactStep value={contactData} onChange={onContactChange} />
          </>
        );

      case "social":
        return (
          <>
            <h2>Social media</h2>

            <p className={styles.stepDescription}>
              Add links to your business social media profiles.
            </p>

            <SocialStep value={socialData} onChange={onSocialChange} />
          </>
        );

      case "location":
        return (
          <>
            <h2>Business location</h2>

            <p className={styles.stepDescription}>
              Add the primary location customers will see on your listing.
            </p>

            <LocationStep value={locationData} onChange={onLocationChange} />
          </>
        );

      case "media":
        return (
          <>
            <h2>Business media</h2>

            <p className={styles.stepDescription}>
              Upload your logo, cover image, and gallery photos.
            </p>

            <MediaStep value={mediaData} onChange={onMediaChange} />
          </>
        );

      case "review":
        return (
          <>
            <h2>Review</h2>

            <p className={styles.stepDescription}>
              Review your business profile before submitting it.
            </p>

            <p>The review section will be added after Media.</p>
          </>
        );

      default:
        return null;
    }
  }

  return (
    <div className={styles.stepContent}>
      <p className={styles.stepLabel}>
        Step {currentStepNumber} of {totalSteps}
      </p>

      {renderStep()}
    </div>
  );
}
