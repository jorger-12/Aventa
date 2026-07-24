import styles from "../VendorOnboarding.module.css";

interface OnboardingNavigationProps {
  canGoBack: boolean;
  canContinue: boolean;
  onBack: () => void;
  onContinue: () => void;
}

export default function OnboardingNavigation({
  canGoBack,
  canContinue,
  onBack,
  onContinue,
}: OnboardingNavigationProps) {
  return (
    <div className={styles.actions}>
      <button
        type="button"
        className={styles.secondaryButton}
        disabled={!canGoBack}
        onClick={onBack}
      >
        Back
      </button>

      <button
        type="button"
        className={styles.primaryButton}
        disabled={!canContinue}
        onClick={onContinue}
      >
        Continue
      </button>
    </div>
  );
}
