"use client";

import { useState } from "react";
import styles from "./BrowseCategories.module.css";
import { categories } from "./categories";

export default function BrowseCategories() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCategory = categories[activeIndex];

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>EXPLORE EVERY PART OF YOUR EVENT</p>
        <h2>Browse Categories</h2>
        <p>Find the services that bring your event together.</p>
      </div>

      <div className={styles.tabs}>
        {categories.map((category, index) => (
          <button
            key={category.name}
            className={index === activeIndex ? styles.activeTab : ""}
            onClick={() => setActiveIndex(index)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className={styles.servicePanel}>
        {activeCategory.services.map((service) => (
          <div className={styles.serviceCard} key={service}>
            <span className={styles.icon}>✦</span>
            <h3>{service}</h3>
            <p>Explore vendors</p>
          </div>
        ))}
      </div>
    </section>
  );
}