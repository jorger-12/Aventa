import styles from "../VendorOnboarding.module.css";

export default function OnboardingHeader() {
  return (
    <header className={styles.header}>
      <p className={styles.eyebrow}>Vendor onboarding</p>

      <h1>Build your business profile</h1>

      <p>
        Add the information customers need to discover and contact your
        business.
      </p>
    </header>
  );
}
