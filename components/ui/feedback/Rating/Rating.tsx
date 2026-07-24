import styles from "./Rating.module.css";

type RatingProps = {
  rating: number;
  reviews?: number;
};

export default function Rating({
  rating,
  reviews,
}: RatingProps) {
  const stars = "★".repeat(Math.round(rating));

  return (
    <div className={styles.rating}>
      <span className={styles.stars}>{stars}</span>

      <span className={styles.value}>
        {rating.toFixed(1)}
      </span>

      {reviews !== undefined && (
        <span className={styles.reviews}>
          ({reviews} Reviews)
        </span>
      )}
    </div>
  );
}