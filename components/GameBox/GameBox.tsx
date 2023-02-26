import { Game } from "@/datatypes/game";
import styles from "./gamebox.module.css";
import Link from "next/link";
import Image from "next/image";
import { CollectionStatus } from "@/pages/api/database/collection/[gameId]";
import { useCallback, useEffect, useState } from "react";

export default function GameBox(props: { game: Game }) {
  const { game } = props;
  const [collectionStatus, setCollectionStatus] = useState<CollectionStatus>({
    own: false,
    wantToPlay: false,
    wishlist: false,
  });
  const [loading, setLoading] = useState(true);

  //TODO Performance improvement, not every game box has to initialize this itself
  const updateData = useCallback(() => {
    return fetch(`/api/database/collection/${game.id}`)
      .then((response) => response.json())
      .then((json) => JSON.parse(json))
      .then((status: CollectionStatus) => {
        setCollectionStatus({
          own: status.own || false,
          wantToPlay: status.wantToPlay || false,
          wishlist: status.wishlist || false,
        });
      });
  }, [game.id]);

  const setStatus = useCallback(
    (status: CollectionStatus) => {
      console.log("HURZ");
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
    setLoading(true);
    updateData().then(() => setLoading(false));
  }, [updateData]);

  return (
    <div className={`${styles.gamebox}`}>
      <div className={styles.imageBox}>
        <Link href={`/app/collection/game/${game.id}`}>
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
          <Link href={`/app/collection/game/${game.id}`}>{game.name}</Link>
        </h3>
      </div>
      <div className={styles.info}>
        <div className={styles.infoBox}>
          <div className={styles.metric}>2-5</div>
          <div className={styles.label}>Players</div>
        </div>
        <div className={styles.infoBox}>
          <div className={styles.metric}>80min</div>
          <div className={styles.label}>Playing time</div>
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
              <i className="bi bi-joystick"></i>
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
