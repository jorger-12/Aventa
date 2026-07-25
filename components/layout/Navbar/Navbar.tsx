"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/hooks";

import styles from "./Navbar.module.css";

export default function Navbar() {
  const router = useRouter();

  const { authenticated, profile, loading, logout } = useAuth();

  const [loggingOut, setLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const canAccessVendorDashboard =
    profile?.role === "vendor" || profile?.role === "admin";

  async function handleLogout() {
    if (loggingOut) {
      return;
    }

    try {
      setLoggingOut(true);

      setMenuOpen(false);

      await logout();

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Unable to log out:", error);
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <nav className={styles.navbar}>
      <Link href="/" aria-label="Aventa home">
        <Image
          src="/assets/logos/Alogo3.png"
          alt="Aventa"
          width={240}
          height={48}
          priority
          className={styles.logo}
        />
      </Link>

      <div className={styles.links}>
        <Link href="/vendors">Browse</Link>
        <Link href="/#how-it-works">How It Works</Link>
        <Link href="/signup">For Vendors</Link>
        <Link href="/#about">About Us</Link>
      </div>

      <div className={styles.actions}>
        {!loading && !authenticated && (
          <>
            <Link href="/login">Log In</Link>

            <Link href="/signup" className={styles.signupButton}>
              Sign Up
            </Link>
          </>
        )}

        {!loading && authenticated && (
          <>
            {canAccessVendorDashboard && (
              <Link href="/vendor-dashboard">Dashboard</Link>
            )}

            <button type="button" onClick={handleLogout} disabled={loggingOut}>
              {loggingOut ? "Logging Out..." : "Log Out"}
            </button>
          </>
        )}
      </div>

      <button
        type="button"
        className={styles.menuButton}
        aria-label="Toggle navigation menu"
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? "✕" : "☰"}
      </button>
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/vendors" onClick={() => setMenuOpen(false)}>
            Browse
          </Link>

          <Link href="/#how-it-works" onClick={() => setMenuOpen(false)}>
            How It Works
          </Link>

          <Link href="/signup" onClick={() => setMenuOpen(false)}>
            For Vendors
          </Link>

          <Link href="/#about" onClick={() => setMenuOpen(false)}>
            About Us
          </Link>

          {!loading && !authenticated && (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)}>
                Log In
              </Link>

              <Link
                href="/signup"
                className={styles.mobileSignup}
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}

          {!loading && authenticated && (
            <>
              {canAccessVendorDashboard && (
                <Link
                  href="/vendor-dashboard"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? "Logging Out..." : "Log Out"}
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
