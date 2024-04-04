"use client";

import { GameCollectionStatus } from "@/datatypes/collection";
import useCollectionStatus from "@/hooks/api/useCollectionStatus";
import useGame from "@/hooks/api/useGame";
import useGameBoxSize from "@/hooks/useGameBoxSize";
import useUserProfile from "@/hooks/useUserProfile";
import GameboxBig from "@/lib/components/parts/gamebox/GameboxBig/GameboxBig";
import GameboxMedium from "@/lib/components/parts/gamebox/GameboxMedium/GameboxMedium";
import useFriendCollectionStatus from "@/lib/hooks/useFriendCollectionStatus";

export interface GameboxProps {
  gameId: number;
}

export default function Gamebox({
  gameId,
}: Readonly<GameboxProps & React.HTMLAttributes<HTMLDivElement>>) {
  const {
    data: friendCollections,
    isLoading: friendCollectionLoading,
    isError: friendCollectionError,
  } = useFriendCollectionStatus(gameId);
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

  const isLoading =
    collectionStatusIsLoading || gameIsLoading || friendCollectionLoading;
  const isError =
    collectionStatusIsError || gameIsError || friendCollectionError;

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
