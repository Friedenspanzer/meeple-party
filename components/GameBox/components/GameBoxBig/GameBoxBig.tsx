import { Game } from "@/datatypes/game";
import { useTranslation } from "@/i18n/client";
import classNames from "classnames";
import Image from "next/image";
import { GameBoxProps } from "../GameBoxMedium/GameBoxMedium";
import styles from "./gameboxbig.module.css";

export default function GameBoxBig({
  game,
  status,
  friendCollection,
  showFriendCollection = false,
}: GameBoxProps) {
  const { t } = useTranslation("game");
  return (
    <div className={classNames("card", styles.card)}>
      {game.image ? (
        <Image
          src={game.image}
          alt={game.name}
          width={250}
          height={250}
          className={classNames(styles.image, "rounded-start")}
        />
      ) : (
        <div className={classNames(styles.image, "rounded-start")} />
      )}
      <div className={styles.info}>
        <MetricList game={game} />
      </div>
      <div className={styles.name}>
        <h2>{game.name}</h2>
      </div>
      <div className={styles.status}>Status</div>
    </div>
  );
}

function MetricList({ game }: { game: Game }) {
  const { t } = useTranslation("game");
  return (
    <>
      <Metric
        text={round(game.weight).toString()}
        label={t("Attributes.Weight")}
      />
      <hr className={styles.metricDivider} />
      <Metric
        text={game.playingTime.toString()}
        label={t("Attributes.PlayingTime")}
      />
      <hr className={styles.metricDivider} />
      <Metric
        text={
          game.minPlayers === game.maxPlayers
            ? game.minPlayers.toString()
            : `${game.minPlayers}-${game.maxPlayers}`
        }
        label={t("Attributes.Players")}
      />
    </>
  );
}

function Metric({ text, label }: { text: string; label: string }) {
  return (
    <div className={styles.metric}>
      <div className={styles.metricTitle}>{text}</div>
      <div className={styles.metricLabel}>{label}</div>
    </div>
  );
}

function round(x: number): number {
  return Math.round(x * 10) / 10;
}
