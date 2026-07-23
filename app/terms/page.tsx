import Link from "next/link";

import LegalPage from "@/components/legal/LegalPage";

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      effectiveDate="July 22, 2026"
    >
      <section>
        <h2>Draft policy notice</h2>

        <p>
          These terms are currently being prepared for
          Aventa&apos;s public launch. The final version
          will explain account requirements, acceptable
          use, vendor listings, payments, disputes,
          intellectual property, and account
          termination.
        </p>
      </section>

      <section>
        <h2>Marketplace use</h2>

        <p>
          By using Aventa, users agree to provide
          accurate information, use the platform
          lawfully, and avoid misleading, fraudulent,
          abusive, or harmful activity.
        </p>
      </section>

      <section>
        <h2>Independent businesses</h2>

        <p>
          Vendors are independent businesses unless
          Aventa clearly states otherwise. Review the{" "}
          <Link href="/disclaimer">
            Platform Disclaimer
          </Link>{" "}
          for more information.
        </p>
      </section>
    </LegalPage>
  );
}