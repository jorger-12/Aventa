import Link from "next/link";

import LegalPage from "@/components/legal/LegalPage";

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Platform Disclaimer"
      effectiveDate="July 22, 2026"
    >
      <section>
        <h2>Marketplace role</h2>

        <p>
          Aventa provides an online marketplace and
          directory that helps users discover and
          connect with independent event vendors.
        </p>

        <p>
          Unless expressly stated otherwise, Aventa
          does not provide the services advertised by
          vendors and is not a party to agreements
          made directly between users and vendors.
        </p>
      </section>

      <section>
        <h2>Independent vendors</h2>

        <p>
          Vendors listed on Aventa operate as
          independent businesses. A listing does not
          automatically represent an endorsement,
          employment relationship, partnership, or
          guarantee by Aventa.
        </p>
      </section>

      <section>
        <h2>User responsibility</h2>

        <p>
          Users should independently review vendor
          qualifications, availability, pricing,
          contracts, insurance, licenses, cancellation
          policies, and other information before
          hiring or paying a vendor.
        </p>
      </section>

      <section>
        <h2>Bookings and disputes</h2>

        <p>
          When transactions occur directly between a
          user and a vendor, those parties are
          responsible for payment arrangements,
          service delivery, cancellations, refunds,
          and disputes.
        </p>
      </section>

      <section>
        <h2>Additional policies</h2>

        <p>
          Your use of Aventa is also governed by our{" "}
          <Link href="/terms">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy">
            Privacy Policy
          </Link>
          .
        </p>
      </section>
    </LegalPage>
  );
}