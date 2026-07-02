import Image from "next/image";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Image
        src="/assets/Logos/Alogo3.png"
        alt="Aventa"
        width={240}
        height={48}
        priority
        className={styles.logo}
      />

      <div className={styles.links}>
        <a href="#">Browse</a>
        <a href="#">How It Works</a>
        <a href="#">For Vendors</a>
        <a href="#">About Us</a>
      </div>

      <div className={styles.actions}>
        <a href="#">Log In</a>
        <button>Sign Up</button>
      </div>

      <button className={styles.menuButton}>☰</button>
    </nav>
  );
}