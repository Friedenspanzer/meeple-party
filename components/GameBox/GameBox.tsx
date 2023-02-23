import { Game } from "@/datatypes/game";
import styles from "./gamebox.module.css";
import Link from "next/link";

export default function GameBox(props: { game: Game }) {
  const { game } = props;
  return (
    <div className={`${styles.gamebox}`}>
      <div className={styles.imageBox}>
        <Link href={`/app/collection/game/${game.id}`}>
          <img
            src={game.image}
            className={`card-img-top ${styles.image}`}
            alt={game.name}
          />
        </Link>
      </div>
      <div className={styles.title}>
        <h3 className="card-title">
          <Link href={`/app/collection/game/${game.id}`}>{game.name}</Link>
        </h3>
      </div>
      <div className={styles.info}></div>
    </div>
  );
}
