"use client";

import { GameCollectionStatus, StatusByUser } from "@/datatypes/collection";
import { Game } from "@/datatypes/game";
import useCollectionStatus from "@/hooks/api/useCollectionStatus";
import useGameBoxSize from "@/hooks/useGameBoxSize";
import useUserProfile from "@/hooks/useUserProfile";
import GameboxBig from "@/lib/components/parts/gamebox/GameboxBig/GameboxBig";
import GameboxMedium from "@/lib/components/parts/gamebox/GameboxMedium/GameboxMedium";
import { useEffect, useState } from "react";

export interface GameBoxProps {
  game: Game;
  friendCollection?: StatusByUser;
  showFriendCollection: boolean;
}

export default function GameBox({
  game,
  friendCollection,
  showFriendCollection = false,
}: Readonly<GameBoxProps & React.HTMLAttributes<HTMLDivElement>>) {
  const gameId = getGameId(game);
  const [gameData, setGameData] = useState<Game>();
  const [friendCollections, setFriendCollections] = useState<StatusByUser>();
  const [gameBoxSize] = useGameBoxSize();
  const { data, mutate } = useCollectionStatus(gameId);
  const { userProfile } = useUserProfile();

  useEffect(() => {
    if (showFriendCollection) {
      if (!friendCollection) {
        fetch(`/api/collection/friends/byGame/${getGameId(game)}`)
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
              `Error loading friend collection data for game ${game}. Reason: ${reason}`
            );
          });
      } else {
        setFriendCollections(friendCollection);
      }
    }
  }, [game, friendCollection, showFriendCollection]);

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

  if (gameData) {
    const friends = friendCollections || {
      own: [],
      wantToPlay: [],
      wishlist: [],
    };
    const my = {
      own: !!data?.own,
      wantToPlay: !!data?.wantToPlay,
      wishlist: !!data?.wishlist,
    };
    const update = (status: Partial<GameCollectionStatus>) => {
      mutate({
        gameId: getGameId(game),
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

function getGameId(game: Game | number) {
  if (typeof game === "number") {
    return game;
  }
  return game.id;
}
