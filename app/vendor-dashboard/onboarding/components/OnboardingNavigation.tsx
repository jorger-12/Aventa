import styles from "../VendorOnboarding.module.css";

interface OnboardingNavigationProps {
  canGoBack: boolean;
  canContinue: boolean;

  isLastStep: boolean;

  isSubmitting?: boolean;

  onBack: () => void;
  onContinue: () => void;
  onSubmit: () => void;
}

export default function OnboardingNavigation({
  canGoBack,
  canContinue,

  isLastStep,

  isSubmitting = false,

  onBack,
  onContinue,
  onSubmit,
}: OnboardingNavigationProps) {
  return (
    <div className={styles.actions}>
      <button
        type="button"
        className={styles.secondaryButton}
        disabled={!canGoBack || isSubmitting}
        onClick={onBack}
      >
        Back
      </button>

      {isLastStep ? (
        <button
          type="button"
          className={styles.primaryButton}
          disabled={isSubmitting}
          onClick={onSubmit}
        >
          {isSubmitting ? "Creating Vendor..." : "Submit Vendor"}
        </button>
      ) : (
        <button
          type="button"
          className={styles.primaryButton}
          disabled={!canContinue || isSubmitting}
          onClick={onContinue}
        >
          Continue
        </button>
      )}
    </div>
  );
}
