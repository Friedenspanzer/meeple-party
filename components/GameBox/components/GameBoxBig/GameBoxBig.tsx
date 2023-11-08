import StatusButton from "@/components/StatusButton/StatusButton";
import { Game } from "@/datatypes/game";
import useCollectionStatus from "@/hooks/api/useCollectionStatus";
import { useTranslation } from "@/i18n/client";
import classNames from "classnames";
import Image from "next/image";
import { useMemo } from "react";
import { GameBoxProps } from "../GameBoxMedium/GameBoxMedium";
import styles from "./gameboxbig.module.css";

export default function GameBoxBig({
  game,
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
      <div className={styles.statusBox}>
        <StatusList gameId={game.id} />
      </div>
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

function StatusList({ gameId }: { gameId: number }) {
  return (
    <div className={styles.statusList}>
      <Status
        gameId={gameId}
        status="own"
        friendCollection={friendCollection}
      />
      <Status
        gameId={gameId}
        status="wanttoplay"
        friendCollection={friendCollection}
      />
      <Status
        gameId={gameId}
        status="wishlist"
        friendCollection={friendCollection}
      />
    </div>
  );
}

function Status({
  gameId,
  friendCollection,
  status,
}: {
  gameId: number;
  friendCollection?: StatusByUser;
  status: "own" | "wishlist" | "wanttoplay";
}) {
  const { t } = useTranslation("default");
  const { data, isLoading } = useCollectionStatus(gameId);
  const state = useMemo(() => {
    if (!data) {
      return false;
    } else if (status === "own") {
      return data.own;
    } else if (status === "wanttoplay") {
      return data.wantToPlay;
    } else if (status === "wishlist") {
      return data.wishlist;
    }
  }, [data, status]);

  const translationBaseKey = useMemo(() => {
    if (status === "own") {
      return "Own";
    } else if (status === "wanttoplay") {
      return "WantToPlay";
    } else if (status === "wishlist") {
      return "Wishlist";
    }
  }, [status]);

  return (
    <div className={styles.status}>
      <StatusButton
        status={status}
        gameId={gameId}
        className={styles.statusButton}
      />
      <div className={styles.statusText}>
        {state
          ? t(`States.${translationBaseKey}`)
          : t(`States.Not${translationBaseKey}`)}
      </div>
    </div>
  );
}

function round(x: number): number {
  return Math.round(x * 10) / 10;
}
