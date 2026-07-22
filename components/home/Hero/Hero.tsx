import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}></div>

      <div className={styles.content}>
        <p className={styles.eyebrow}>DISCOVER • COMPARE • BOOK</p>

        <h1>
          Plan your entire
          <br />
          event in one place.
        </h1>

        <p className={styles.description}>
          Find trusted venues, planners, DJs, photographers, caterers, rentals,
          and more—all from a single search.
        </p>

        <div className={styles.searchBox}>
          <div className={styles.searchField}>
            <span>🔍</span>
            <input placeholder="Search vendors or services..." />
          </div>

          <div className={styles.searchField}>
            <span>📍</span>
            <input placeholder="Location" />
          </div>

          <button>Search</button>
        </div>
      </div>
    </section>
  );
}