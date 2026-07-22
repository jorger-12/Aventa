import styles from "./FeaturedVendors.module.css";
import { vendors } from "./vendors";

export default function FeaturedVendors() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>CURATED LOCAL TALENT</p>
          <h2>Featured Vendors</h2>
        </div>

        <a href="#">View all vendors →</a>
      </div>

      <div className={styles.grid}>
        {vendors.map((vendor) => (
          <article className={styles.card} key={vendor.name}>
            <div
              className={styles.image}
              style={{ backgroundImage: `url(${vendor.image})` }}
            />

            <div className={styles.content}>
              <h3>{vendor.name}</h3>
              <p className={styles.category}>{vendor.category}</p>

              <p className={styles.rating}>
                {vendor.rating} <span>★★★★★</span> ({vendor.reviews})
              </p>

              <p className={styles.location}>📍 {vendor.location}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}