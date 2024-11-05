"use client";

import useCollectionStatus from "@/feature/game-collection/hooks/useCollectionStatus";
import { CollectionStatus } from "@/pages/api/collection/[gameId]";
import { Group } from "@mantine/core";
import Spinner from "../../../../lib/components/Spinner/Spinner";
import StatusButton from "../StatusButton/StatusButton";

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
  const { data, isLoading } = useCollectionStatus(gameId);

  return (
    <div {...props}>
      {isLoading && <Spinner />}
      {!isLoading && data && (
        <Group justify="space-around">
          <StatusButton gameId={gameId} status="own" />
          <StatusButton gameId={gameId} status="wanttoplay" />
          <StatusButton gameId={gameId} status="wishlist" />
        </Group>
      )}
    </div>
  );
}
