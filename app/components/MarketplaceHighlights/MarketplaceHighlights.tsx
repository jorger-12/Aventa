import styles from "./MarketplaceHighlights.module.css";

export default function MarketplaceHighlights() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3>Top Rated</h3>
            <a href="#">View all →</a>
          </div>

          <div className={styles.vendorRow}>
            <span className={styles.rank}>1</span>
            <div>
              <h4>Elegant Affairs</h4>
              <p>5.0 ★★★★★</p>
            </div>
          </div>

          <div className={styles.vendorRow}>
            <span className={styles.rank}>2</span>
            <div>
              <h4>Captured Moments</h4>
              <p>5.0 ★★★★★</p>
            </div>
          </div>

          <div className={styles.vendorRow}>
            <span className={styles.rank}>3</span>
            <div>
              <h4>Beat Masters</h4>
              <p>4.9 ★★★★★</p>
            </div>
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3>New on Aventa</h3>
            <a href="#">View all →</a>
          </div>

          <div className={styles.vendorRow}>
            <span className={styles.newBadge}>NEW</span>
            <div>
              <h4>Luxe Decor</h4>
              <p>Event Decorator</p>
            </div>
          </div>

          <div className={styles.vendorRow}>
            <span className={styles.newBadge}>NEW</span>
            <div>
              <h4>Spark Moments</h4>
              <p>Photo Booth</p>
            </div>
          </div>

          <div className={styles.vendorRow}>
            <span className={styles.newBadge}>NEW</span>
            <div>
              <h4>Chic Bites</h4>
              <p>Catering</p>
            </div>
          </div>
        </div>

        <div className={styles.vendorPanel}>
          <h3>Join Aventa</h3>
          <p>Grow your business and get discovered by people planning real events.</p>

          <ul>
            <li>Reach more customers</li>
            <li>Showcase your services</li>
            <li>Get booked with ease</li>
          </ul>

          <button>Become a Vendor</button>
        </div>
      </div>
    </section>
  );
}