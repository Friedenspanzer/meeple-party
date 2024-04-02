"use client";

import { GameCollectionStatus, StatusByUser } from "@/datatypes/collection";
import useCollectionStatus from "@/hooks/api/useCollectionStatus";
import useGame from "@/hooks/api/useGame";
import useGameBoxSize from "@/hooks/useGameBoxSize";
import useUserProfile from "@/hooks/useUserProfile";
import GameboxBig from "@/lib/components/parts/gamebox/GameboxBig/GameboxBig";
import GameboxMedium from "@/lib/components/parts/gamebox/GameboxMedium/GameboxMedium";
import { useEffect, useState } from "react";

export interface GameBoxProps {
  gameId: number;
  friendCollection?: StatusByUser;
  showFriendCollection: boolean;
}

export default function GameBox({
  gameId,
  friendCollection,
  showFriendCollection = false,
}: Readonly<GameBoxProps & React.HTMLAttributes<HTMLDivElement>>) {
  const [friendCollections, setFriendCollections] = useState<StatusByUser>();
  const [gameBoxSize] = useGameBoxSize();
  const {
    data: collectionStatus,
    mutate: updateCollectionStatus,
    isLoading: collectionStatusIsLoading,
    isError: collectionStatusIsError,
  } = useCollectionStatus(gameId);
  const { userProfile } = useUserProfile();
  const {
    data: gameData,
    isLoading: gameIsLoading,
    isError: gameIsError,
  } = useGame(gameId);

  const isLoading = collectionStatusIsLoading || gameIsLoading;
  const isError = collectionStatusIsError || gameIsError;

  useEffect(() => {
    if (showFriendCollection) {
      if (!friendCollection) {
        fetch(`/api/collection/friends/byGame/${gameId}`)
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw Error(`${response.status} ${response.statusText}`);
            }
          })
          .then(setFriendCollections)
          .catch((reason) => {
            throw Error(
              `Error loading friend collection data for game ${gameId}. Reason: ${reason}`
            );
          });
      } else {
        setFriendCollections(friendCollection);
      }
    }
  }, [gameId, friendCollection, showFriendCollection]);

  if (gameData) {
    const friends = friendCollections || {
      own: [],
      wantToPlay: [],
      wishlist: [],
    };
    const my = {
      own: !!collectionStatus?.own,
      wantToPlay: !!collectionStatus?.wantToPlay,
      wishlist: !!collectionStatus?.wishlist,
    };
    const update = (status: Partial<GameCollectionStatus>) => {
      updateCollectionStatus({
        gameId,
        userId: userProfile?.id,
        ...status,
      });
    };
    if (gameBoxSize === "md") {
      return (
        <GameboxMedium
          game={gameData}
          friendCollections={friends}
          myCollection={my}
          updateStatus={update}
        />
      );
    } else if (gameBoxSize === "xl") {
      return (
        <GameboxBig
          game={gameData}
          friendCollections={friends}
          myCollection={my}
          updateStatus={update}
        />
      );
    }
  } else {
    return <>…</>;
  }
}
