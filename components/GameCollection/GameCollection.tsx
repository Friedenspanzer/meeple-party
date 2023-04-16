"use client";

import { GameCollectionStatus, StatusByUser } from "@/datatypes/collection";
import { Game } from "@/datatypes/game";
import classNames from "classnames";
import { useCallback, useEffect, useState } from "react";
import GameBox from "../GameBox/GameBox";
import styles from "./gamecollection.module.css";
import { useDebounce } from "use-debounce";
import validator from "validator";

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
  const [inputPage, setInputPage] = useState("1");
  const totalNumberOfPages = Math.ceil(games.length / ITEMS_PER_PAGE);

  const [debouncedInputPage] = useDebounce(inputPage, 1000);

  const getOffset = useCallback(() => {
    return page * ITEMS_PER_PAGE;
  }, [page]);

  useEffect(() => {
    setInputPage(`${page + 1}`);
  }, [page]);

  useEffect(() => {
    if (
      debouncedInputPage.length === 0 ||
      !validator.isInt(debouncedInputPage)
    ) {
      setInputPage(validator.toString(page + 1));
    } else {
      const targetPage = validator.toInt(debouncedInputPage);
      if (targetPage < 1) {
        setPage(0);
      } else if (targetPage > totalNumberOfPages) {
        setPage(totalNumberOfPages - 1);
      } else {
        setPage(targetPage - 1);
      }
    }
  }, [debouncedInputPage, totalNumberOfPages]);

  return (
    <div {...props}>
      {children}
      <div className={styles.container}>
        <div className={styles.games}>
          {games
            .slice(getOffset(), getOffset() + ITEMS_PER_PAGE)
            .map(({ game, status, friendCollections }) => (
              <GameBox
                game={game}
                status={status}
                key={getGameId(game)}
                showFriendCollection={showFriendCollection}
                friendCollection={friendCollections}
                className={styles.gameBox}
              />
            ))}
        </div>
        {totalNumberOfPages > 1 && (
          <>
            <div className={classNames("btn-group", styles.pages)}>
              {pageButtons(totalNumberOfPages, page, setPage)}
            </div>
            <div>
              <input
                type="number"
                value={inputPage}
                onChange={(e) => setInputPage(e.currentTarget.value)}
                aria-label="Current page"
                className={styles.page}
              />{" "}
              of {totalNumberOfPages}
            </div>
          </>
        )}
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
  const pagesToShow = Array();
  pagesToShow.push(0);
  for (
    let i = Math.max(currentPage - 2, 1);
    i <= Math.min(currentPage + 2, totalNumberOfPages - 2);
    i++
  ) {
    pagesToShow.push(i);
  }
  pagesToShow.push(totalNumberOfPages - 1);
  let lastButtonShown = -1;
  return (
    <>
      {pagesToShow.map((page) => {
        const showFiller = lastButtonShown !== page - 1;
        lastButtonShown = page;
        return (
          <>
            {showFiller && (
              <button
                type="button"
                className="btn btn-outline-primary"
                disabled
              >
                …
              </button>
            )}
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
          </>
        );
      })}
    </>
  );
}

export default GameCollection;
