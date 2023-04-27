"use client";

import { GameCollectionStatus, StatusByUser } from "@/datatypes/collection";
import { Game } from "@/datatypes/game";
import classNames from "classnames";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import validator from "validator";
import Fuse from "fuse.js";
import GameBox from "../GameBox/GameBox";
import GameCollectionFilter, {
  FilterPreset,
  GameCollectionFilterOptions,
} from "../GameCollectionFilter/GameCollectionFilter";
import styles from "./gamecollection.module.css";
import { emptyFilter } from "@/utility/filter";

type GameInfo = {
  game: Game;
  status?: GameCollectionStatus;
  friendCollections?: StatusByUser;
};

export interface GameCollectionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  games: GameInfo[];
  showFriendCollection?: boolean;
  showFilter?: boolean;
  filterPresets?: FilterPreset[];
  children?: React.ReactNode;
}

type FilterFunction = (
  filter: GameCollectionFilterOptions,
  games: GameInfo[]
) => GameInfo[];

const ITEMS_PER_PAGE = 15;

const GameCollection: React.FC<GameCollectionProps> = ({
  games,
  showFriendCollection = false,
  showFilter = true,
  filterPresets = getDefaultFilterPresets(),
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
        {showFilter && (
          <GameCollectionFilter
            onFilterChange={setFilter}
            totalCount={games.length}
            filteredCount={filteredGames.length}
            presets={filterPresets}
          />
        )}
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

function getDefaultFilterPresets(): FilterPreset[] {
  return [
    {
      name: "Own",
      filter: { ...emptyFilter, collectionStatus: { own: true } },
    },
    {
      name: "Want to play",
      filter: { ...emptyFilter, collectionStatus: { wantToPlay: true } },
    },
    {
      name: "Wishlist",
      filter: { ...emptyFilter, collectionStatus: { wishlist: true } },
    },
    {
      name: "Own and want to play",
      filter: {
        ...emptyFilter,
        collectionStatus: { own: true, wantToPlay: true },
      },
    },
  ];
}

function applyFilters(
  filter: GameCollectionFilterOptions,
  games: GameInfo[]
): GameInfo[] {
  return chainFilters(filter, games, [
    nameFilter,
    playerCountFilter,
    collectionFilter,
    playingTimeFilter,
    weightFilter,
    friendFilter,
  ]);
}

function chainFilters(
  filter: GameCollectionFilterOptions,
  games: GameInfo[],
  filterFunctions: FilterFunction[]
) {
  let filteredGames = games;
  filterFunctions.forEach((f) => {
    filteredGames = f(filter, filteredGames);
  });
  return filteredGames;
}

const nameFilter: FilterFunction = (filter, games) => {
  if (!filter.name) {
    return games;
  }
  const fuse = new Fuse(games, { keys: ["game.name"], threshold: 0.34 });
  return [...fuse.search(filter.name)].map((g) => g.item);
};

const playerCountFilter: FilterFunction = (filter, games) => {
  if (!filter.playerCount.count) {
    return [...games];
  } else if (filter.playerCount.type === "exact") {
    return [
      ...games.filter(
        (g) =>
          g.game.minPlayers === filter.playerCount.count &&
          g.game.maxPlayers === filter.playerCount.count
      ),
    ];
  } else if (filter.playerCount.type === "atleast") {
    return [
      ...games.filter((g) => g.game.minPlayers <= filter.playerCount.count!),
    ];
  } else if (filter.playerCount.type === "supports") {
    return [
      ...games.filter(
        (g) =>
          g.game.minPlayers <= filter.playerCount.count! &&
          g.game.maxPlayers >= filter.playerCount.count!
      ),
    ];
  }
  return [...games];
};

const playingTimeFilter: FilterFunction = (filter, games) => {
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
};

const weightFilter: FilterFunction = (filter, games) => {
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
};

const collectionFilter: FilterFunction = (filter, games) => {
  let filteredGames = games;
  if (filter.collectionStatus.own !== undefined) {
    filteredGames = filteredGames.filter(
      (g) => g.status?.own === filter.collectionStatus.own
    );
  }
  if (filter.collectionStatus.wantToPlay !== undefined) {
    filteredGames = filteredGames.filter(
      (g) => g.status?.wantToPlay === filter.collectionStatus.wantToPlay
    );
  }
  if (filter.collectionStatus.wishlist !== undefined) {
    filteredGames = filteredGames.filter(
      (g) => g.status?.wishlist === filter.collectionStatus.wishlist
    );
  }
  return filteredGames;
};

const friendFilter: FilterFunction = (filter, games) => {
  return chainFilters(filter, games, [
    friendOwnFilter,
    friendWantToPlayFilter,
    friendWishlistFilter,
  ]);
};

const friendOwnFilter: FilterFunction = (filter, games) => {
  let filteredGames = games;
  if (filter.friends.own.max) {
    filteredGames = filteredGames.filter(
      (g) => (g.friendCollections?.own.length || 0) <= filter.friends.own.max!
    );
  }
  if (filter.friends.own.min) {
    filteredGames = filteredGames.filter(
      (g) => (g.friendCollections?.own.length || 0) >= filter.friends.own.min!
    );
  }
  return filteredGames;
};
const friendWantToPlayFilter: FilterFunction = (filter, games) => {
  let filteredGames = games;
  if (filter.friends.wantToPlay.max) {
    filteredGames = filteredGames.filter(
      (g) =>
        (g.friendCollections?.wantToPlay.length || 0) <=
        filter.friends.wantToPlay.max!
    );
  }
  if (filter.friends.wantToPlay.min) {
    filteredGames = filteredGames.filter(
      (g) =>
        (g.friendCollections?.wantToPlay.length || 0) >=
        filter.friends.wantToPlay.min!
    );
  }
  return filteredGames;
};

const friendWishlistFilter: FilterFunction = (filter, games) => {
  let filteredGames = games;
  if (filter.friends.wishlist.max) {
    filteredGames = filteredGames.filter(
      (g) =>
        (g.friendCollections?.wishlist.length || 0) <=
        filter.friends.wishlist.max!
    );
  }
  if (filter.friends.wishlist.min) {
    filteredGames = filteredGames.filter(
      (g) =>
        (g.friendCollections?.wishlist.length || 0) >=
        filter.friends.wishlist.min!
    );
  }
  return filteredGames;
};

export default GameCollection;
