"use client";

import GameBox from "@/components/GameBox/GameBox";
import { Game } from "@/datatypes/game";
import { GameCollection } from "@prisma/client";
import { useEffect, useState } from "react";

type State = "owned" | "wishlist" | "wanttoplay";
interface GameCollectionWithGame extends GameCollection {
  game: Game;
}

export default function Collection() {
  const [gameCollection, setGameCollection] = useState<
    GameCollectionWithGame[]
  >([]);
  const [currentPage, setCurrentPage] = useState<State>("owned");
  useEffect(() => {
    fetch("/api/database/collection")
      .then((result) => result.json())
      .then((gameCollection) => setGameCollection(gameCollection));
  }, []);
  return (
    <>
      {gameCollection
        .filter((g) => g.wantToPlay)
        .map((g) => (
          <GameBox game={g.game} status={g} key={g.game.id} />
        ))}
    </>
  );
}
