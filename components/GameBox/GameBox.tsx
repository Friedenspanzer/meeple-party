"use client";

import { Game } from "@/datatypes/game";
import styles from "./gamebox.module.css";
import Link from "next/link";
import Image from "next/image";
import { CollectionStatus } from "@/pages/api/collection/[gameId]";
import { useCallback, useEffect, useState } from "react";
import Spinner from "../Spinner/Spinner";
import classNames from "classnames";

export interface GameBoxProps {
  game: Game | number;
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
  const [gameData, setGameData] = useState<Game>();

  const setStatus = useCallback(
    (status: CollectionStatus) => {
      setLoading(true);
      fetch(`/api/collection/${getGameId(game)}`, {
        method: "POST",
        body: JSON.stringify(status),
      })
        .then(() =>
          //TODO Error handling
          setCollectionStatus(status)
        )
        .then(() => setLoading(false));
    },
    [game]
  );

  useEffect(() => {
    if (!!status) {
      setCollectionStatus(status);
    } else {
      setLoading(true);
      fetch(`/api/collection/${getGameId(game)}`)
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
  }, [setStatus, status, game]);

  useEffect(() => {
    if (typeof game === "number") {
      fetch(`/api/games/${game}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw Error(`${response.status} ${response.statusText}`);
          }
        })
        .then(setGameData)
        .catch((reason) => {
          throw Error(`Error loading data for game ${game}. Reason: ${reason}`);
        });
    } else {
      setGameData(game);
    }
  }, [game]);

  return gameData ? (
    <div className={`${styles.gamebox}`}>
      <div className={styles.imageBox}>
        <Link href={`/app/game/${gameData.id}`}>
          {!!gameData.image && (
            <Image
              src={gameData.image}
              className={`card-img-top ${styles.image}`}
              alt={gameData.name}
              width="200"
              height="150"
            />
          )}
        </Link>
      </div>
      <div className={styles.title}>
        <h3 className="card-title">
          <Link href={`/app/game/${gameData.id}`}>{gameData.name}</Link>
        </h3>
      </div>
      <div className={styles.info}>
        <div className={styles.infoBox}>
          <div className={styles.metric}>
            {gameData.minPlayers === gameData.maxPlayers ? (
              gameData.minPlayers
            ) : (
              <>
                {gameData.minPlayers}-{gameData.maxPlayers}
              </>
            )}
          </div>
          <div className={styles.label}>Players</div>
        </div>
        <div className={styles.infoBox}>
          <div className={styles.metric}>{gameData.playingTime}</div>
          <div className={styles.label}>Playing time</div>
        </div>
        <div className={styles.infoBox}>
          <div className={styles.metric}>{round(gameData.weight)}</div>
          <div className={styles.label}>Weight</div>
        </div>
      </div>
      <div className={styles.collectionStatus}>
        {loading && (
          <div className={styles.spinner}>
            <Spinner />
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
  ) : (
    <div className={classNames(styles.gamebox, "shimmer")} />
  );
}

function getGameId(game: Game | number) {
  if (typeof game === "number") {
    return game;
  }
  return game.id;
}

function round(x: number): number {
  return Math.round(x * 10) / 10;
}

//TODO "x friends own" and "x friends want to play"
