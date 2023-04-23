"use client";

import { GameCollectionStatus, StatusByUser } from "@/datatypes/collection";
import { Game } from "@/datatypes/game";
import classNames from "classnames";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import validator from "validator";
import GameBox from "../GameBox/GameBox";
import GameCollectionFilter, {
  GameCollectionFilterOptions,
} from "../GameCollectionFilter/GameCollectionFilter";
import styles from "./gamecollection.module.css";

type GameInfo = {
  game: Game;
  status?: GameCollectionStatus;
  friendCollections?: StatusByUser;
};

export interface GameCollectionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  games: GameInfo[];
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
  const [filter, setFilter] = useState<GameCollectionFilterOptions>();

  const [debouncedInputPage] = useDebounce(inputPage, 1000);

  const filteredGames = useMemo(() => {
    if (!filter) {
      return games;
    } else {
      return applyFilters(filter, games);
    }
  }, [filter, games]);

  const totalNumberOfPages = useMemo(() => {
    return Math.ceil(filteredGames.length / ITEMS_PER_PAGE);
  }, [filteredGames]);

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

  useEffect(() => {
    if (page > totalNumberOfPages) {
      setPage(0);
    }
  }, [totalNumberOfPages, page]);

  return (
    <div {...props}>
      {children}
      <div className={styles.container}>
        <GameCollectionFilter
          onFilterChange={setFilter}
          totalCount={games.length}
          filteredCount={filteredGames.length}
        />
        <div className={styles.games}>
          {filteredGames
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
  const pageElements: JSX.Element[] = [];
  pagesToShow.forEach((page) => {
    if (lastButtonShown !== page - 1) {
      pageElements.push(
        <button
          type="button"
          className="btn btn-outline-primary"
          key={page + totalNumberOfPages + 10}
          disabled
        >
          …
        </button>
      );
    }
    lastButtonShown = page;
    pageElements.push(
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
    );
  });
  return pageElements;
}

function applyFilters(
  filter: GameCollectionFilterOptions,
  games: GameInfo[]
): GameInfo[] {
  return applyPlayingTimeFilters(filter, applyWeightFilters(filter, games));
}

function applyPlayingTimeFilters(
  filter: GameCollectionFilterOptions,
  games: GameInfo[]
): GameInfo[] {
  let filteredGames = games;
  if (filter.playingTime.max) {
    filteredGames = filteredGames.filter(
      (g) => g.game.playingTime <= filter.playingTime.max!
    );
  }
  if (filter.playingTime.min) {
    filteredGames = filteredGames.filter(
      (g) => g.game.playingTime >= filter.playingTime.min!
    );
  }
  return filteredGames;
}

function applyWeightFilters(
  filter: GameCollectionFilterOptions,
  games: GameInfo[]
): GameInfo[] {
  let filteredGames = games;
  if (filter.weight.max) {
    filteredGames = filteredGames.filter(
      (g) => g.game.weight <= filter.weight.max!
    );
  }
  if (filter.weight.min) {
    filteredGames = filteredGames.filter(
      (g) => g.game.weight >= filter.weight.min!
    );
  }
  return filteredGames;
}

export default GameCollection;
