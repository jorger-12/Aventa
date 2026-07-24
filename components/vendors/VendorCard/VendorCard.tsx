import Image from "next/image";
import Link from "next/link";

import Badge from "@/components/ui/feedback/Badge/Badge";
import Rating from "@/components/ui/feedback/Rating/Rating";

import styles from "./VendorCard.module.css";

type VendorCardProps = {
  id: string;
  name: string;
  category: string;
  location: string;
  image: string;
  rating: number;
  reviews?: number;
  featured?: boolean;
  verified?: boolean;
};

export default function VendorCard({
  id,
  name,
  category,
  location,
  image,
  rating,
  reviews,
  featured = false,
  verified = false,
}: VendorCardProps) {
  return (
    <article className={styles.card}>
      <Link href={`/vendors/${id}`} className={styles.imageLink}>
        <div className={styles.imageWrapper}>
          <Image
            src={image}
            alt={name}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, 33vw"
          />

          <div className={styles.badges}>
            {featured && <Badge>Featured</Badge>}
            {verified && <Badge variant="success">Verified</Badge>}
          </div>
        </div>
      </Link>

      <div className={styles.content}>
        <p className={styles.category}>{category}</p>

        <Link href={`/vendors/${id}`} className={styles.titleLink}>
          <h3 className={styles.name}>{name}</h3>
        </Link>

        <p className={styles.location}>{location}</p>

        <Rating rating={rating} reviews={reviews} />
      </div>
    </article>
  );
}
