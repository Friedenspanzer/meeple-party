import BggRating from "@/components/BggRating/BggRating";
import { ExpandedGame } from "@/datatypes/game";
import { getGameLanguage, getTranslation } from "@/i18n";
import { getBggGame } from "@/utility/bgg";
import classNames from "classnames";
import Image from "next/image";
import styles from "./GamePageHeader.module.css";

interface GamePageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  game: ExpandedGame;
}

export default async function GamePageHeader({
  game,
  ...props
}: GamePageHeaderProps) {
  const { t } = await getTranslation("game");
  const language = await getGameLanguage();
  const bggGame = await getBggGame(game.id);
  const gameDesigners =
    bggGame.designers.length <= 5
      ? bggGame.designers
      : [
          ...bggGame.designers.slice(0, 5),
          t("Page.More", { count: bggGame.designers.length - 5 }),
        ];
  const gameArtists =
    bggGame.artists.length <= 5
      ? bggGame.artists
      : [
          ...bggGame.artists.slice(0, 5),
          t("Page.More", { count: bggGame.artists.length - 5 }),
        ];
  return (
    <div
      {...props}
      className={classNames(props.className, styles.header, {
        [styles.noImage]: !bggGame.image,
      })}
    >
      {bggGame.image && (
        <Image
          src={bggGame.image}
          width={600}
          height={200}
          alt={bggGame.name}
          className={styles.headerImage}
          unoptimized
        />
      )}
      <div
        className={classNames(styles.headerContent, {
          [styles.noImage]: !bggGame.image,
        })}
      >
        {bggGame.image && (
          <Image
            src={bggGame.image || ""}
            width={200}
            height={200}
            alt={bggGame.name}
            className={styles.titleImage}
            unoptimized
          />
        )}
        <div className={styles.headerInformation}>
          <BggRating
            rating={bggGame.BGGRating}
            rank={bggGame.BGGRank}
            className={styles.rating}
          />
          <h2 className={styles.gameName}>{getName(game, language)}</h2>
          <span className={styles.gameYear}>{bggGame.year}</span>
          {gameDesigners.length > 0 && (
            <div className={classNames(styles.staff, styles.design)}>
              <h3>{t("Page.Header.Design")}</h3>
              <ul>
                {[...gameDesigners].reverse().map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          )}
          {gameArtists.length > 0 && (
            <div className={classNames(styles.staff, styles.art)}>
              <h3>{t("Page.Header.Art")}</h3>
              <ul>
                {[...gameArtists].reverse().map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          )}
          <div
            className={classNames(styles.playerCount, styles.additionalInfo)}
          >
            {bggGame.maxPlayers === bggGame.minPlayers
              ? bggGame.maxPlayers
              : `${bggGame.minPlayers}-${bggGame.maxPlayers}`}
            <small>{t("Page.Header.Players")}</small>
          </div>
          <div
            className={classNames(styles.playingTime, styles.additionalInfo)}
          >
            {bggGame.playingTime}
            <small>{t("Page.Header.Minutes")}</small>
          </div>
          <div className={classNames(styles.weight, styles.additionalInfo)}>
            {round(bggGame.weight)}
            <small>{t("Page.Header.Weight")}</small>
          </div>
        </div>
      </div>
    </div>
  );
}

function round(i: number): number {
  return Math.round(i * 10) / 10;
}

function getName(game: ExpandedGame, language: string): string {
  const name = game.names.find((n) => n.language === language);
  if (name) {
    return name.name;
  }
  return game.name;
}
