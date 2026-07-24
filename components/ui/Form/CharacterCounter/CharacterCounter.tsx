import styles from "./CharacterCounter.module.css";

interface CharacterCounterProps {
  current: number;
  max: number;
}

export default function CharacterCounter({
  current,
  max,
}: CharacterCounterProps) {
  const isNearLimit = current >= max * 0.9;
  const isAtLimit = current >= max;

  return (
    <p
      className={`${styles.counter} ${
        isAtLimit ? styles.limit : isNearLimit ? styles.warning : ""
      }`.trim()}
      aria-live="polite"
    >
      {current}/{max} characters
    </p>
  );
}
