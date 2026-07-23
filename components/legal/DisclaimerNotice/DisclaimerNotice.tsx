"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import styles from "./DisclaimerNotice.module.css";

const STORAGE_KEY = "aventa-disclaimer-version";
const DISCLAIMER_VERSION = "1.0";

export default function DisclaimerNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const acceptedVersion =
      window.localStorage.getItem(STORAGE_KEY);

    if (acceptedVersion !== DISCLAIMER_VERSION) {
      setVisible(true);
    }
  }, []);

  function handleContinue() {
    window.localStorage.setItem(
      STORAGE_KEY,
      DISCLAIMER_VERSION,
    );

    setVisible(false);
  }

  if (!visible) {
    return null;
  }

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-title"
      aria-describedby="disclaimer-description"
    >
      <div className={styles.notice}>
        <p className={styles.eyebrow}>Welcome to Aventa</p>

        <h2
          id="disclaimer-title"
          className={styles.title}
        >
          Please review how Aventa works
        </h2>

        <p
          id="disclaimer-description"
          className={styles.description}
        >
          Aventa helps customers discover and connect
          with independent event vendors. Vendor
          services, pricing, availability, contracts,
          and business information are provided by the
          vendors themselves.
        </p>

        <p className={styles.description}>
          By continuing, you acknowledge that Aventa
          operates as a marketplace and directory and
          that you should independently review a vendor
          before hiring or paying them.
        </p>

        <div className={styles.links}>
          <Link href="/disclaimer">
            Platform Disclaimer
          </Link>

          <Link href="/terms">
            Terms of Service
          </Link>

          <Link href="/privacy">
            Privacy Policy
          </Link>
        </div>

        <button
          type="button"
          className={styles.button}
          onClick={handleContinue}
        >
          Continue to Aventa
        </button>
      </div>
    </div>
  );
}