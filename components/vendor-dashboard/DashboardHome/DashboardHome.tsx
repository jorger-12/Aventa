"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useAuth } from "@/lib/hooks";
import { getOwnerVendors } from "@/lib/services/vendor.service";
import type { Vendor } from "@/types/vendor";

import styles from "./DashboardHome.module.css";

type DashboardState =
  | { status: "loading" }
  | { status: "success"; vendor: Vendor }
  | { status: "empty" }
  | { status: "error"; message: string };

export default function DashboardHome() {
  const { user, loading: authLoading } = useAuth();

  const [dashboardState, setDashboardState] = useState<DashboardState>({
    status: "loading",
  });

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      if (authLoading) {
        return;
      }

      if (!user) {
        if (isMounted) {
          setDashboardState({
            status: "error",
            message: "Your authentication session could not be found.",
          });
        }

        return;
      }

      try {
        const vendors = await getOwnerVendors(user.uid);

        if (!isMounted) {
          return;
        }

        const vendor = vendors[0];

        if (!vendor) {
          setDashboardState({ status: "empty" });
          return;
        }

        setDashboardState({
          status: "success",
          vendor,
        });
      } catch (error) {
        console.error("Failed to load vendor dashboard:", error);

        if (!isMounted) {
          return;
        }

        setDashboardState({
          status: "error",
          message: "Your vendor profile could not be loaded.",
        });
      }
    }

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [authLoading, user]);

  if (dashboardState.status === "loading" || authLoading) {
    return (
      <main className={styles.page}>
        <div className={styles.stateCard}>
          <div className={styles.spinner} />

          <h1>Loading dashboard</h1>

          <p>We’re retrieving your Aventa business profile.</p>
        </div>
      </main>
    );
  }

  if (dashboardState.status === "empty") {
    return (
      <main className={styles.page}>
        <div className={styles.stateCard}>
          <span className={styles.eyebrow}>Vendor account</span>

          <h1>Finish setting up your business</h1>

          <p>
            No vendor profile is connected to this account yet. Complete
            onboarding to begin managing your listing.
          </p>

          <Link
            href="/vendor-dashboard/onboarding"
            className={styles.primaryButton}
          >
            Complete onboarding
          </Link>
        </div>
      </main>
    );
  }

  if (dashboardState.status === "error") {
    return (
      <main className={styles.page}>
        <div className={styles.stateCard}>
          <span className={styles.eyebrow}>Something went wrong</span>

          <h1>Dashboard unavailable</h1>

          <p>{dashboardState.message}</p>

          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  return <DashboardContent vendor={dashboardState.vendor} />;
}

function DashboardContent({ vendor }: { vendor: Vendor }) {
  const galleryImages = vendor.media?.galleryImages ?? [];
  const primaryLocation = vendor.locations[0];

  const locationLabel = primaryLocation
    ? `${primaryLocation.address.city}, ${primaryLocation.address.state}`
    : "No location added";

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Vendor Dashboard</p>

            <h1 className={styles.title}>
              Welcome back, {vendor.businessName}
            </h1>

            <p className={styles.subtitle}>
              Manage your business profile, photos, listing status, and Aventa
              account.
            </p>
          </div>

          <div className={styles.headerActions}>
            <Link
              href={`/vendors/${vendor.slug}`}
              className={styles.secondaryButton}
            >
              View public profile
            </Link>

            <Link
              href="/vendor-dashboard/edit"
              className={styles.primaryButton}
            >
              Edit profile
            </Link>
          </div>
        </header>

        <section className={styles.statusGrid}>
          <StatusCard
            label="Profile"
            value={vendor.profileCompleted ? "Complete" : "Incomplete"}
            description={
              vendor.profileCompleted
                ? "Your business information is complete."
                : "Your profile still needs information."
            }
          />

          <StatusCard
            label="Listing"
            value={vendor.active ? "Active" : "Inactive"}
            description={
              vendor.active
                ? "Your listing is enabled."
                : "Your listing is currently hidden."
            }
          />

          <StatusCard
            label="Verification"
            value={vendor.verified ? "Verified" : "Pending"}
            description={
              vendor.verified
                ? "Your business has been verified."
                : "Verification has not been completed."
            }
          />

          <StatusCard
            label="Subscription"
            value={formatLabel(vendor.subscriptionPlan)}
            description={`${formatLabel(
              vendor.subscriptionStatus,
            )} subscription`}
          />
        </section>

        <section className={styles.profileCard}>
          <div className={styles.cover}>
            {vendor.media?.coverImageUrl ? (
              <Image
                src={vendor.media.coverImageUrl}
                alt={`${vendor.businessName} cover`}
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                className={styles.coverImage}
                priority
              />
            ) : (
              <div className={styles.coverPlaceholder}>
                Add a business cover image
              </div>
            )}
          </div>

          <div className={styles.profileContent}>
            <div className={styles.logoWrapper}>
              {vendor.media?.logoUrl ? (
                <Image
                  src={vendor.media.logoUrl}
                  alt={`${vendor.businessName} logo`}
                  fill
                  sizes="112px"
                  className={styles.logo}
                />
              ) : (
                <span>{vendor.businessName.charAt(0).toUpperCase()}</span>
              )}
            </div>

            <div className={styles.businessDetails}>
              <div>
                <h2>{vendor.businessName}</h2>
                <p>{vendor.shortDescription}</p>
              </div>

              <div className={styles.detailGrid}>
                <BusinessDetail label="Email" value={vendor.email} />

                <BusinessDetail label="Phone" value={vendor.phone} />

                <BusinessDetail label="Location" value={locationLabel} />

                <BusinessDetail
                  label="Profile URL"
                  value={`/vendors/${vendor.slug}`}
                />
              </div>
            </div>
          </div>
        </section>

        <div className={styles.contentGrid}>
          <section className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <div>
                <span className={styles.eyebrow}>Business gallery</span>
                <h2>Your photos</h2>
              </div>

              <span className={styles.countBadge}>
                {galleryImages.length} photo
                {galleryImages.length === 1 ? "" : "s"}
              </span>
            </div>

            {galleryImages.length > 0 ? (
              <div className={styles.gallery}>
                {galleryImages.slice(0, 6).map((imageUrl, index) => (
                  <div className={styles.galleryItem} key={imageUrl}>
                    <Image
                      src={imageUrl}
                      alt={`${vendor.businessName} gallery image ${index + 1}`}
                      fill
                      sizes="(max-width: 700px) 50vw, 220px"
                      className={styles.galleryImage}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyGallery}>
                <p>No gallery photos have been added yet.</p>
              </div>
            )}
          </section>

          <aside className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <div>
                <span className={styles.eyebrow}>Management</span>
                <h2>Quick actions</h2>
              </div>
            </div>

            <nav className={styles.quickActions}>
              <DashboardLink
                href="/vendor-dashboard/edit"
                title="Edit business profile"
                description="Update your business details and services."
              />

              <DashboardLink
                href="/vendor-dashboard/media"
                title="Manage photos"
                description="Add, replace, or remove business images."
              />

              <DashboardLink
                href="/vendor-dashboard/subscription"
                title="Manage subscription"
                description="Review your plan and available upgrades."
              />

              <div className={styles.disabledAction}>
                <div>
                  <strong>Reviews and analytics</strong>
                  <span>Coming soon</span>
                </div>
              </div>
            </nav>
          </aside>
        </div>
      </div>
    </main>
  );
}

function StatusCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <article className={styles.statusCard}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{description}</p>
    </article>
  );
}

function BusinessDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.businessDetail}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function DashboardLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link href={href} className={styles.quickAction}>
      <div>
        <strong>{title}</strong>
        <span>{description}</span>
      </div>

      <span aria-hidden="true">→</span>
    </Link>
  );
}

function formatLabel(value: string): string {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
