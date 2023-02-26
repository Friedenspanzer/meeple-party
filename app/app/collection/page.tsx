"use client";

import GameBox from "@/components/GameBox/GameBox";
import { Game } from "@/datatypes/game";
import { fetchGames } from "@/utility/games";
import { GameCollection } from "@prisma/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./collection.module.css";

type State = "owned" | "wishlist" | "wanttoplay";
interface GameCollectionWithGame extends GameCollection {
  game: Game;
}

function collectionFilter(currentState: State, game: GameCollectionWithGame) {
  return (
    (currentState === "owned" && game.own) ||
    (currentState === "wishlist" && game.wishlist) ||
    (currentState === "wanttoplay" && game.wantToPlay)
  );
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
      <ul className="nav nav-pills">
        <li className="nav-item">
          <button
            className={`nav-link ${currentPage === "owned" ? "active" : ""}`}
            aria-current="page"
            onClick={(e) => setCurrentPage("owned")}
          >
            Owned games
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${currentPage === "wishlist" ? "active" : ""}`}
            onClick={(e) => setCurrentPage("wishlist")}
          >
            Wishlist
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${
              currentPage === "wanttoplay" ? "active" : ""
            }`}
            onClick={(e) => setCurrentPage("wanttoplay")}
          >
            Games you want to play
          </button>
        </li>
        <li className="nav-item">
          <Link href="/app/collection/sync" className="nav-link">
            Import from BoardGameGeek
          </Link>
        </li>
      </ul>
      {gameCollection
        .filter((g) => collectionFilter(currentPage, g))
        .map((g) => (
          <GameBox game={g.game} status={g} key={g.game.id} />
        ))}
    </>
  );
}
