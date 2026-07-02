import styles from "./EventCarousel.module.css";
import { events } from "./events";

export default function EventCarousel() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>START WITH YOUR OCCASION</p>
        <h2>Browse by Event</h2>
        <p>Explore vendors tailored to every celebration.</p>
      </div>

      <div className={styles.carousel}>
        {events.map((event) => (
          <div
            key={event.title}
            className={styles.card}
            style={{ backgroundImage: `url(${event.image})` }}
          >
            <div className={styles.overlay}></div>

            <div className={styles.cardContent}>
              <h3>{event.title}</h3>
              <p>{event.count}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}