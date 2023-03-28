"use client";

import { CollectionStatus } from "@/pages/api/collection/[gameId]";
import { useCallback, useEffect, useState } from "react";
import styles from "./collectionstatusbuttons.module.css";
import Spinner from "../Spinner/Spinner";
import classNames from "classnames";

export interface CollectionStatusButtonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  gameId: number;
  status?: CollectionStatus;
}

export default function CollectionStatusButtons({
  gameId,
  status,
  ...props
}: CollectionStatusButtonProps) {
  const [loading, setLoading] = useState(false);
  const [collectionStatus, setCollectionStatus] = useState<CollectionStatus>({
    own: false,
    wantToPlay: false,
    wishlist: false,
  });

  const setStatus = useCallback(
    (status: CollectionStatus) => {
      setLoading(true);
      fetch(`/api/collection/${gameId}`, {
        method: "POST",
        body: JSON.stringify(status),
      })
        .then(() =>
          //TODO Error handling
          setCollectionStatus(status)
        )
        .then(() => setLoading(false));
    },
    [gameId]
  );

  useEffect(() => {
    if (!!status) {
      setCollectionStatus(status);
    } else {
      setLoading(true);
      fetch(`/api/collection/${gameId}`)
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
  }, [status, gameId]);

  return (
    <div
      className={classNames(styles.collectionStatus, props.className)}
      {...props}
    >
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
  );
}
