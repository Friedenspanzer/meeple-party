import { StatusByUser } from "@/datatypes/collection";
import { Game } from "@/datatypes/game";
import { CollectionStatus } from "@/pages/api/collection/[gameId]";
import { useEffect, useState } from "react";
import GameBoxBig from "./components/GameBoxBig/GameBoxBig";

export interface GameBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  game: Game | number;
  status?: CollectionStatus;
  friendCollection?: StatusByUser;
  showFriendCollection: boolean;
}

export default function GameBox({
  game,
  status,
  friendCollection,
  showFriendCollection = false,
}: GameBoxProps) {
  const [gameData, setGameData] = useState<Game>();
  const [friendCollections, setFriendCollections] = useState<StatusByUser>();

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
    return (
      <GameBoxBig
        game={gameData}
        status={status}
        friendCollection={friendCollections}
        showFriendCollection={showFriendCollection}
      />
    );
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
