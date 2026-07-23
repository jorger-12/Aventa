import LegalPage from "@/components/legal/LegalPage";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      effectiveDate="July 22, 2026"
    >
      <section>
        <h2>Draft policy notice</h2>

        <p>
          This policy is currently being prepared for
          Aventa&apos;s public launch and will be updated
          as the platform&apos;s data collection and
          third-party services are finalized.
        </p>
      </section>

      <section>
        <h2>Information collected</h2>

        <p>
          Aventa may collect account information,
          contact details, vendor profile information,
          uploaded media, platform activity, and
          technical information needed to operate and
          secure the service.
        </p>
      </section>

      <section>
        <h2>How information is used</h2>

        <p>
          Information may be used to provide accounts,
          display vendor listings, support users,
          improve the platform, prevent abuse, and
          comply with applicable obligations.
        </p>
      </section>

      <section>
        <h2>Account controls</h2>

        <p>
          Additional options for accessing, correcting,
          and deleting account information will be
          provided as Aventa&apos;s account management
          system is completed.
        </p>
      </section>
    </LegalPage>
  );
}