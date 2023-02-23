import { Game } from "@/datatypes/game";
import styles from "./gamebox.module.css";
import Image from "next/image";

export default function GameBox(props: { game: Game }) {
  const { game } = props;
  return (
    <div className={`${styles.gamebox}`}>
      <div className={styles.imageBox}>
        <img
          src={game.image}
          className={`card-img-top ${styles.image}`}
          alt={game.name}
        />
      </div>
      <div className={styles.title}>
        <h3 className="card-title">{game.name}</h3>
      </div>
      <div className={styles.info}></div>
    </div>
  );
}
