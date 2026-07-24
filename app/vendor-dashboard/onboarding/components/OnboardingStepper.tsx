import type { OnboardingStep, OnboardingStepItem } from "../types";

import styles from "../VendorOnboarding.module.css";

interface OnboardingStepperProps {
  steps: OnboardingStepItem[];
  currentStep: OnboardingStep;
  currentStepIndex: number;
  onSelectStep: (step: OnboardingStep) => void;
}

export default function OnboardingStepper({
  steps,
  currentStep,
  currentStepIndex,
  onSelectStep,
}: OnboardingStepperProps) {
  return (
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
            onClick={() => onSelectStep(step.id)}
            aria-current={isActive ? "step" : undefined}
          >
            <span>{index + 1}</span>
            {step.label}
          </button>
        );
      })}
    </nav>
  );
}
