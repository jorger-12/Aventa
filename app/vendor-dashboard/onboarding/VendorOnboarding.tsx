"use client";

import { useState } from "react";

import OnboardingHeader from "./components/OnboardingHeader";

import OnboardingStepper from "./components/OnboardingStepper";

import OnboardingNavigation from "./components/OnboardingNavigation";

import OnboardingStepRenderer from "./components/OnboardingStepRenderer";

import {
  initialVendorProfile,
  type VendorOnboardingData,
} from "./reducers/vendorProfileReducer";

import type { OnboardingStep, OnboardingStepItem } from "./types";

import type { BusinessStepData } from "./steps/BusinessStep";
import type { ServicesStepData } from "./steps/ServicesStep";
import type { ContactStepData } from "./steps/ContactStep";
import type { SocialStepData } from "./steps/SocialStep";
import type { LocationStepData } from "./steps/LocationStep";
import type { MediaStepData } from "./steps/MediaStep";

import styles from "./VendorOnboarding.module.css";

const steps: OnboardingStepItem[] = [
  { id: "business", label: "Business" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
  { id: "social", label: "Social" },
  { id: "location", label: "Location" },
  { id: "media", label: "Media" },
  { id: "review", label: "Review" },
];

export default function VendorOnboarding() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("business");

  const [vendorProfile, setVendorProfile] =
    useState<VendorOnboardingData>(initialVendorProfile);

  function updateBusinessData(value: BusinessStepData) {
    setVendorProfile((currentProfile) => ({
      ...currentProfile,
      businessName: value.businessName,
      shortDescription: value.shortDescription,
      description: value.description,
    }));
  }

  function updateServicesData(value: ServicesStepData) {
    setVendorProfile((currentProfile) => ({
      ...currentProfile,
      primaryCategoryId: value.primaryCategoryId,
      businessTypeIds: value.businessTypeIds,
    }));
  }

  function updateContactData(value: ContactStepData) {
    setVendorProfile((currentProfile) => ({
      ...currentProfile,
      phone: value.phone,
      email: value.email,
      website: value.website,
    }));
  }

  function updateSocialData(value: SocialStepData) {
    setVendorProfile((currentProfile) => ({
      ...currentProfile,
      facebook: value.facebook,
      instagram: value.instagram,
      tiktok: value.tiktok,
    }));
  }

  function updateLocationData(value: LocationStepData) {
    setVendorProfile((currentProfile) => ({
      ...currentProfile,
      location: value,
    }));
  }

  function updateMediaData(value: MediaStepData) {
    setVendorProfile((currentProfile) => ({
      ...currentProfile,
      media: value,
    }));
  }

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);

  function isBusinessStepComplete() {
    return (
      vendorProfile.businessName.trim() !== "" &&
      vendorProfile.shortDescription.trim() !== "" &&
      vendorProfile.description.trim() !== ""
    );
  }

  function isContactStepComplete() {
    return (
      vendorProfile.phone.trim() !== "" && vendorProfile.email.trim() !== ""
    );
  }

  function isLocationStepComplete() {
    return (
      vendorProfile.location.locationName.trim() !== "" &&
      vendorProfile.location.street.trim() !== "" &&
      vendorProfile.location.city.trim() !== "" &&
      vendorProfile.location.state.trim() !== "" &&
      vendorProfile.location.zipCode.trim() !== "" &&
      vendorProfile.location.country.trim() !== ""
    );
  }

  function goToNextStep() {
    const nextStep = steps[currentStepIndex + 1];

    if (nextStep) {
      setCurrentStep(nextStep.id);
    }
  }

  function goToPreviousStep() {
    const previousStep = steps[currentStepIndex - 1];

    if (previousStep) {
      setCurrentStep(previousStep.id);
    }
  }

  const canContinue =
    currentStepIndex < steps.length - 1 &&
    !(
      (currentStep === "business" && !isBusinessStepComplete()) ||
      (currentStep === "contact" && !isContactStepComplete()) ||
      (currentStep === "location" && !isLocationStepComplete())
    );

  return (
    <main className={styles.page}>
      <section className={styles.container}>
        <OnboardingHeader />

        <OnboardingStepper
          steps={steps}
          currentStep={currentStep}
          currentStepIndex={currentStepIndex}
          onSelectStep={setCurrentStep}
        />

        <section className={styles.card}>
          <OnboardingStepRenderer
            currentStep={currentStep}
            currentStepNumber={currentStepIndex + 1}
            totalSteps={steps.length}
            businessData={{
              businessName: vendorProfile.businessName,
              shortDescription: vendorProfile.shortDescription,
              description: vendorProfile.description,
            }}
            servicesData={{
              primaryCategoryId: vendorProfile.primaryCategoryId,
              businessTypeIds: vendorProfile.businessTypeIds,
            }}
            contactData={{
              phone: vendorProfile.phone,
              email: vendorProfile.email,
              website: vendorProfile.website,
            }}
            socialData={{
              facebook: vendorProfile.facebook,
              instagram: vendorProfile.instagram,
              tiktok: vendorProfile.tiktok,
            }}
            locationData={vendorProfile.location}
            mediaData={vendorProfile.media}
            onBusinessChange={updateBusinessData}
            onServicesChange={updateServicesData}
            onContactChange={updateContactData}
            onSocialChange={updateSocialData}
            onLocationChange={updateLocationData}
            onMediaChange={updateMediaData}
          />

          <OnboardingNavigation
            canGoBack={currentStepIndex > 0}
            canContinue={canContinue}
            onBack={goToPreviousStep}
            onContinue={goToNextStep}
          />
        </section>
      </section>
    </main>
  );
}
