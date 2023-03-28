import Image from "next/image";
import { notFound } from "next/navigation";
import styles from "./gamepage.module.css";
import classNames from "classnames";
import { getBggGame } from "@/utility/bgg";
import BggRating from "@/components/BggRating/BggRating";

export default async function Game({ params }: { params: { gameId: string } }) {
  const id = Number.parseInt(params.gameId);
  if (!Number.isInteger(id)) {
    notFound();
  }
  try {
    const game = await getBggGame(id);
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Image
            src={game.image || ""}
            width={600}
            height={200}
            alt={game.name}
            className={styles.headerImage}
          />
          <div className={styles.headerContent}>
            <Image
              src={game.image || ""}
              width={200}
              height={200}
              alt={game.name}
              className={styles.titleImage}
            />
            <div className={styles.headerInformation}>
              <BggRating
                rating={game.BGGRating}
                rank={game.BGGRank}
                className={styles.rating}
              />
              <h2 className={styles.gameName}>{game.name}</h2>
              <span className={styles.gameYear}>{game.year}</span>
              {game.designers.length > 0 && (
                <div className={classNames(styles.staff, styles.design)}>
                  <h3>Design</h3>
                  <ul>
                    {[...game.designers].reverse().map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}
              {game.artists.length > 0 && (
                <div className={classNames(styles.staff, styles.art)}>
                  <h3>Art</h3>
                  <ul>
                    {[...game.artists].reverse().map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div
                className={classNames(
                  styles.playerCount,
                  styles.additionalInfo
                )}
              >
                {game.maxPlayers === game.minPlayers
                  ? game.maxPlayers
                  : `${game.minPlayers}-${game.maxPlayers}`}
                <small>players</small>
              </div>
              <div
                className={classNames(
                  styles.playingTime,
                  styles.additionalInfo
                )}
              >
                {game.playingTime}
                <small>minutes</small>
              </div>
              <div className={classNames(styles.weight, styles.additionalInfo)}>
                {round(game.weight)}
                <small>weight</small>
              </div>
            </div>
          </div>
        </div>
        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: game.description }}
        ></div>
      </div>
    );
  } catch (e) {
    console.error("Error fetching game data", e);
    notFound();
  }
}

function round(i: number): number {
  return Math.round(i * 10) / 10;
}
