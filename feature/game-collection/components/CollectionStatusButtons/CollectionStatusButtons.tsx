"use client";

import useCollectionStatus from "@/feature/game-collection/hooks/useCollectionStatus";
import { useTranslation } from "@/i18n/client";
import { CollectionStatus } from "@/pages/api/collection/[gameId]";
import { Group } from "@mantine/core";
import classNames from "classnames";
import Spinner from "../../../../lib/components/Spinner/Spinner";
import StatusButton from "../StatusButton/StatusButton";
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
        <Group align="space-around">
          <StatusButton gameId={gameId} status="own" />
          <StatusButton gameId={gameId} status="wanttoplay" />
          <StatusButton gameId={gameId} status="wishlist" />
        </Group>
      )}
    </div>
  );
}
