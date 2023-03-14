"use client";

import { Game } from "@/datatypes/game";
import styles from "./gamebox.module.css";
import Link from "next/link";
import Image from "next/image";
import { CollectionStatus } from "@/pages/api/database/collection/[gameId]";
import { useCallback, useEffect, useState } from "react";

export interface GameBoxProps {
  game: Game;
  status?: CollectionStatus;
}

export default function GameBox(props: GameBoxProps) {
  const { game, status } = props;
  const [collectionStatus, setCollectionStatus] = useState<CollectionStatus>({
    own: false,
    wantToPlay: false,
    wishlist: false,
  });
  const [loading, setLoading] = useState(false);

  const setStatus = useCallback(
    (status: CollectionStatus) => {
      setLoading(true);
      fetch(`/api/database/collection/${game.id}`, {
        method: "POST",
        body: JSON.stringify(status),
      })
        .then(() =>
          //TODO Error handling
          setCollectionStatus(status)
        )
        .then(() => setLoading(false));
    },
    [game.id]
  );

  useEffect(() => {
    if (!!status) {
      setCollectionStatus(status);
    } else {
      setLoading(true);
      fetch(`/api/database/collection/${game.id}`)
        .then((response) => response.json())
        .then((json) => JSON.parse(json))
        .then((status: CollectionStatus) => {
          setCollectionStatus({
            own: status.own || false,
            wantToPlay: status.wantToPlay || false,
            wishlist: status.wishlist || false,
          });
        })
        .then(() => setLoading(false));
    }
  }, [setStatus, status, game.id]);

  return (
    <div className={`${styles.gamebox}`}>
      <div className={styles.imageBox}>
        <Link href={`/app/game/${game.id}`}>
          {!!game.image && (
            <Image
              src={game.image}
              className={`card-img-top ${styles.image}`}
              alt={game.name}
              width="200"
              height="150"
            />
          )}
        </Link>
      </div>
      <div className={styles.title}>
        <h3 className="card-title">
          <Link href={`/app/game/${game.id}`}>{game.name}</Link>
        </h3>
      </div>
      <div className={styles.info}>
        <div className={styles.infoBox}>
          <div className={styles.metric}>
            {game.minPlayers === game.maxPlayers ? (
              game.minPlayers
            ) : (
              <>
                {game.minPlayers}-{game.maxPlayers}
              </>
            )}
          </div>
          <div className={styles.label}>Players</div>
        </div>
        <div className={styles.infoBox}>
          <div className={styles.metric}>{game.playingTime}</div>
          <div className={styles.label}>Playing time</div>
        </div>
        <div className={styles.infoBox}>
          <div className={styles.metric}>{round(game.weight)}</div>
          <div className={styles.label}>Weight</div>
        </div>
      </div>
      <div className={styles.collectionStatus}>
        {loading && (
          <div className={styles.spinner}>
            <div className="spinner-border" />
          </div>
        )}
        {!loading && (
          <>
            <button
              className={
                styles.collectionStatusButton +
                " " +
                (collectionStatus.own && styles.own)
              }
              onClick={() =>
                setStatus({
                  ...collectionStatus,
                  own: !collectionStatus.own,
                })
              }
            >
              <i className="bi bi-box-seam-fill"></i>
            </button>
            <button
              className={
                styles.collectionStatusButton +
                " " +
                (collectionStatus.wantToPlay && styles.wantToPlay)
              }
              onClick={() =>
                setStatus({
                  ...collectionStatus,
                  wantToPlay: !collectionStatus.wantToPlay,
                })
              }
            >
              <i className="bi bi-dice-3-fill"></i>
            </button>
            <button
              className={
                styles.collectionStatusButton +
                " " +
                (collectionStatus.wishlist && styles.wishlist)
              }
              onClick={() =>
                setStatus({
                  ...collectionStatus,
                  wishlist: !collectionStatus.wishlist,
                })
              }
            >
              <i className="bi bi-gift-fill"></i>
            </button>{" "}
          </>
        )}
      </div>
    </div>
  );
}

function round(x: number): number {
  return Math.round(x * 10) / 10;
}

//TODO "x friends own" and "x friends want to play"