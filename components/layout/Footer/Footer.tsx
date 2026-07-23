import Image from "next/image";
import Link from "next/link";

import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <Image
            src="/assets/logos/Alogo3.png"
            alt="Aventa"
            width={260}
            height={52}
            priority
            className={styles.logo}
          />

          <p className={styles.tagline}>Discover • Compare • Book</p>

          <p className={styles.description}>
            Find trusted local vendors for weddings, birthdays, corporate
            events, and every celebration in between.
          </p>

          <div className={styles.socials}>
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
            <a href="#">TikTok</a>
          </div>
        </div>

        <div className={styles.links}>
          <div>
            <h3>Company</h3>
            <a href="#">About</a>
            <a href="#">Careers</a>
            <a href="#">Blog</a>
            <a href="#">Contact</a>
          </div>

          <div>
            <h3>Support</h3>
            <a href="#">Help Center</a>
            <a href="#">Safety</a>
            <a href="#">FAQs</a>
            <a href="#">Contact Support</a>
          </div>

          <div>
            <h3>Vendors</h3>
            <a href="#">List Your Business</a>
            <a href="#">Pricing</a>
            <a href="#">Resources</a>
            <a href="#">Success Stories</a>
          </div>

          <div>
            <h3>Legal</h3>

            <Link href="/privacy">
              Privacy Policy
            </Link>

            <Link href="/terms">
              Terms of Service
            </Link>

            <Link href="/disclaimer">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>Connecting communities with trusted local vendors.</p>
        <p>© 2026 Aventa. All Rights Reserved.</p>
      </div>
    </footer>
  );
}