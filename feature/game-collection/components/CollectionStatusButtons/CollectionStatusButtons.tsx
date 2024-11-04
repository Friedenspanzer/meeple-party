"use client";

import useCollectionStatus from "@/feature/game-collection/hooks/useCollectionStatus";
import { useTranslation } from "@/i18n/client";
import { CollectionStatus } from "@/pages/api/collection/[gameId]";
import classNames from "classnames";
import Spinner from "../../../../lib/components/Spinner/Spinner";
import styles from "./collectionstatusbuttons.module.css";

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
  const { t } = useTranslation();
  const { data, isLoading, updateMutation } = useCollectionStatus(gameId);

  return (
    <div
      className={classNames(styles.collectionStatus, props.className)}
      {...props}
    >
      {isLoading && (
        <div className={styles.spinner}>
          <Spinner />
        </div>
      )}
      {!isLoading && data && (
        <>
          <button
            className={
              styles.collectionStatusButton + " " + (data.own && styles.own)
            }
            onClick={() => updateMutation.mutate({ ...data, own: !data.own })}
            title={t("States.Own")}
          >
            <i className="bi bi-box-seam-fill"></i>
          </button>
          <button
            className={
              styles.collectionStatusButton +
              " " +
              (data.wantToPlay && styles.wantToPlay)
            }
            onClick={() =>
              updateMutation.mutate({ ...data, wantToPlay: !data.wantToPlay })
            }
            title={t("States.WantToPlay")}
          >
            <i className="bi bi-dice-3-fill"></i>
          </button>
          <button
            className={
              styles.collectionStatusButton +
              " " +
              (data.wishlist && styles.wishlist)
            }
            onClick={() =>
              updateMutation.mutate({ ...data, wishlist: !data.wishlist })
            }
            title={t("States.Wishlist")}
          >
            <i className="bi bi-gift-fill"></i>
          </button>{" "}
        </>
      )}
    </div>
  );
}
