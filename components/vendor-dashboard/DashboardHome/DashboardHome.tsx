"use client";

import { useAuth } from "@/lib/hooks";

import styles from "./DashboardHome.module.css";

interface DashboardItem {
  title: string;
  description: string;
  status: string;
}

const dashboardItems: DashboardItem[] = [
  {
    title: "Business Profile",
    description:
      "Add your business name, description, contact details, and category.",
    status: "Incomplete",
  },
  {
    title: "Business Logo",
    description: "Upload the main logo customers will see across Aventa.",
    status: "Not uploaded",
  },
  {
    title: "Photo Gallery",
    description:
      "Show customers your services, venue, work, and previous events.",
    status: "0 photos",
  },
  {
    title: "Business Location",
    description: "Add your business address and service area.",
    status: "Not set",
  },
  {
    title: "Business Hours",
    description: "Let customers know when your business is available.",
    status: "Not set",
  },
  {
    title: "Services",
    description: "List the services and event options your business provides.",
    status: "Not added",
  },
];

export default function DashboardHome() {
  const { profile } = useAuth();

  const firstName = profile?.firstName || profile?.displayName || "Vendor";

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Vendor Dashboard</p>

            <h1 className={styles.title}>Welcome, {firstName}</h1>

            <p className={styles.subtitle}>
              Complete your business profile so customers can discover you on
              Aventa.
            </p>
          </div>

          <div className={styles.plan}>
            <span className={styles.planLabel}>Current plan</span>

            <strong>Free</strong>
          </div>
        </header>

        <section
          className={styles.progressSection}
          aria-labelledby="profile-progress-title"
        >
          <div className={styles.progressHeader}>
            <div>
              <h2 id="profile-progress-title">Profile progress</h2>

              <p>
                Complete the sections below before publishing your business.
              </p>
            </div>

            <strong className={styles.progressValue}>0%</strong>
          </div>

          <div
            className={styles.progressTrack}
            aria-label="Profile completion: 0 percent"
          >
            <div className={styles.progressBar} style={{ width: "0%" }} />
          </div>
        </section>

        <section className={styles.grid} aria-label="Vendor profile setup">
          {dashboardItems.map((item) => (
            <article key={item.title} className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>{item.title}</h2>

                <span className={styles.status}>{item.status}</span>
              </div>

              <p>{item.description}</p>

              <button type="button" className={styles.cardButton} disabled>
                Set up
              </button>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
