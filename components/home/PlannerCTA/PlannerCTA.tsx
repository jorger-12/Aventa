import styles from "./PlannerCTA.module.css";

export default function PlannerCTA() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.icon}>👤</div>

          <div>
            <h2>Not sure where to start?</h2>
            <p>
              Connect with an event planning expert and receive personalized
              recommendations for your event.
            </p>
          </div>
        </div>

        <button className={styles.button}>
          Talk to a Planner
        </button>
      </div>
    </section>
  );
}