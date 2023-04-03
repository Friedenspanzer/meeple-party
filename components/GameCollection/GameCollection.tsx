"use client";

import { GameCollectionStatus, StatusByUser } from "@/datatypes/collection";
import { Game } from "@/datatypes/game";
import classNames from "classnames";
import { useCallback, useState } from "react";
import GameBox from "../GameBox/GameBox";
import styles from "./gamecollection.module.css";

export interface GameCollectionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  games: {
    game: Game | number;
    status?: GameCollectionStatus;
    friendCollections?: StatusByUser;
  }[];
  showFriendCollection?: boolean;
  children?: React.ReactNode;
}

const ITEMS_PER_PAGE = 15;

const GameCollection: React.FC<GameCollectionProps> = ({
  games,
  showFriendCollection = false,
  children,
  ...props
}) => {
  const [page, setPage] = useState(0);
  const totalNumberOfPages = Math.ceil(games.length / ITEMS_PER_PAGE);

  const getOffset = useCallback(() => {
    return page * ITEMS_PER_PAGE;
  }, [page]);

  return (
    <div {...props}>
      {children}
      <div className={styles.container}>
        <div className={styles.games}>
          {games
            .slice(getOffset(), getOffset() + ITEMS_PER_PAGE)
            .map(({ game, status }) => (
              <GameBox
                game={game}
                status={status}
                key={getGameId(game)}
                showFriendCollection={showFriendCollection}
              />
            ))}
        </div>
        <div className={classNames("btn-group", styles.pages)}>
          {pageButtons(totalNumberOfPages, page, setPage)}
        </div>
      </div>
    </div>
  );
};

function getGameId(game: number | Game): number {
  if (typeof game === "number") {
    return game;
  }
  return game.id;
}

function pageButtons(
  totalNumberOfPages: number,
  currentPage: number,
  setPage: (page: number) => void
) {
  const pages = Array(totalNumberOfPages);
  for (let i = 0; i < totalNumberOfPages; i++) {
    pages[i] = i;
  }
  return (
    <>
      {pages.map((page) => (
        <button
          type="button"
          className={classNames("btn btn-primary", {
            active: page === currentPage,
          })}
          key={page}
          onClick={() => setPage(page)}
        >
          {page + 1}
        </button>
      ))}
    </>
  );
}

export default GameCollection;
