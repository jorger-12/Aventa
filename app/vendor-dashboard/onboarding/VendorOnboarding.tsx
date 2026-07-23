"use client";

import { useState } from "react";

import BusinessStep, { type BusinessStepData } from "./steps/BusinessStep";

import ServicesStep, { type ServicesStepData } from "./steps/ServicesStep";

import styles from "./VendorOnboarding.module.css";

type OnboardingStep =
  | "business"
  | "services"
  | "contact"
  | "social"
  | "location"
  | "media"
  | "review";

const steps: {
  id: OnboardingStep;
  label: string;
}[] = [
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

  const [businessData, setBusinessData] = useState<BusinessStepData>({
    businessName: "",
    shortDescription: "",
    description: "",
  });

  const [servicesData, setServicesData] = useState<ServicesStepData>({
    primaryCategory: "",
    businessTypeIds: [],
  });

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);

  function isBusinessStepComplete() {
    return (
      businessData.businessName.trim() !== "" &&
      businessData.shortDescription.trim() !== "" &&
      businessData.description.trim() !== ""
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

  return (
    <main className={styles.page}>
      <section className={styles.container}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Vendor onboarding</p>

          <h1>Build your business profile</h1>

          <p>
            Add the information customers need to discover and contact your
            business.
          </p>
        </header>

        <nav className={styles.steps} aria-label="Vendor onboarding progress">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = index < currentStepIndex;

            return (
              <button
                key={step.id}
                type="button"
                className={`${styles.step} ${
                  isActive ? styles.activeStep : ""
                } ${isCompleted ? styles.completedStep : ""}`}
                onClick={() => setCurrentStep(step.id)}
              >
                <span>{index + 1}</span>
                {step.label}
              </button>
            );
          })}
        </nav>

        <section className={styles.card}>
          <div className={styles.stepContent}>
            <p className={styles.stepLabel}>
              Step {currentStepIndex + 1} of {steps.length}
            </p>

            {currentStep === "business" ? (
              <>
                <h2>Business information</h2>

                <p className={styles.stepDescription}>
                  Add the main details customers will see on your listing.
                </p>

                <BusinessStep value={businessData} onChange={setBusinessData} />
              </>
            ) : currentStep === "services" ? (
              <>
                <h2>Services</h2>

                <p className={styles.stepDescription}>
                  Choose the services your business provides.
                </p>

                <ServicesStep value={servicesData} onChange={setServicesData} />
              </>
            ) : (
              <>
                <h2>{steps[currentStepIndex].label}</h2>

                <p>The form for this section will be added next.</p>
              </>
            )}
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.secondaryButton}
              disabled={currentStepIndex === 0}
              onClick={goToPreviousStep}
            >
              Back
            </button>

            <button
              type="button"
              className={styles.primaryButton}
              disabled={
                currentStepIndex === steps.length - 1 ||
                (currentStep === "business" && !isBusinessStepComplete())
              }
              onClick={goToNextStep}
            >
              Continue
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}
