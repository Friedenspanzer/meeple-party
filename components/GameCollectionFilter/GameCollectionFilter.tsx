import classNames from "classnames";
import { useCallback, useEffect, useId, useState } from "react";
import styles from "./gamecollectionfilter.module.css";
import MinMaxSliders from "./components/MinMaxSlider";
import Section from "./components/Section";
import FilterOverview from "./components/FilterOverview";
import CollectionStatus, {
  getCombinedText,
} from "./components/CollectionStatus";
import PlayerCount from "./components/PlayerCount";

export interface GameCollectionFilterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onFilterChange: (filter: GameCollectionFilterOptions) => void;
  totalCount: number;
  filteredCount: number;
  presets?: FilterPreset[];
}

export type MinMaxFilterOption = {
  min?: number;
  max?: number;
};

export type CollectionStatusFilterOption = {
  own?: boolean;
  wantToPlay?: boolean;
  wishlist?: boolean;
};

export type PlayerCountFilterOption = {
  type: "exact" | "supports" | "atleast";
  count?: number;
};

export interface GameCollectionFilterOptions {
  name?: string;
  weight: MinMaxFilterOption;
  playingTime: MinMaxFilterOption;
  collectionStatus: CollectionStatusFilterOption;
  playerCount: PlayerCountFilterOption;
}

export type FilterPreset = {
  name: string;
  filter: GameCollectionFilterOptions;
};

const GameCollectionFilter: React.FC<GameCollectionFilterProps> = ({
  onFilterChange,
  totalCount,
  filteredCount,
  presets,
  ...props
}) => {
  const offcanvasId = useId();

  const [filter, setFilter] = useState<GameCollectionFilterOptions>(
    getEmptyFilter()
  );

  useEffect(() => {
    onFilterChange(filter);
  }, [filter, onFilterChange]);

  const changeName = useCallback((name?: string) => {
    setFilter((filter) => ({ ...filter, name }));
  }, []);

  const changeWeight = useCallback((weight: MinMaxFilterOption) => {
    setFilter((filter) => ({ ...filter, weight }));
  }, []);

  const changePlayingTime = useCallback((playingTime: MinMaxFilterOption) => {
    setFilter((filter) => ({ ...filter, playingTime }));
  }, []);

  const changeCollectionStatus = useCallback(
    (collectionStatus: CollectionStatusFilterOption) => {
      setFilter((filter) => ({ ...filter, collectionStatus }));
    },
    []
  );

  const changePlayerCount = useCallback(
    (playerCount: PlayerCountFilterOption) => {
      setFilter((filter) => ({ ...filter, playerCount }));
    },
    []
  );

  return (
    <div {...props} className={classNames(props.className, "container")}>
      <div className="row g-2">
        <div className="col-md-1">
          {presets ? (
            <div className="btn-group">
              <button
                className={classNames("btn", {
                  "btn-primary": anyFilterActive(filter),
                  "btn-outline-primary": !anyFilterActive(filter),
                })}
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target={`#${offcanvasId}`}
                aria-controls={offcanvasId}
              >
                <i className="bi bi-funnel-fill"></i>
              </button>
              <div className="btn-group dropend" role="group">
                <button
                  type="button"
                  className="btn btn-outline-primary dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                ></button>
                <ul className="dropdown-menu">
                  <li>
                    <h6 className="dropdown-header">Filter presets</h6>
                  </li>
                  {presets.map((p) => (
                    <li key={p.name}>
                      <button
                        className="dropdown-item"
                        onClick={() => setFilter(p.filter)}
                      >
                        {p.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <button
              className={classNames("btn", {
                "btn-primary": anyFilterActive(filter),
                "btn-outline-primary": !anyFilterActive(filter),
              })}
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target={`#${offcanvasId}`}
              aria-controls={offcanvasId}
            >
              <i className="bi bi-funnel-fill"></i>
            </button>
          )}
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Game name"
            value={filter.name}
            onChange={(e) => changeName(e.target.value)}
          />
        </div>
        <div className="col-md-7">
          <FilterOverview
            filter={filter}
            onFilterChange={(filter) => setFilter(filter)}
          />
        </div>
      </div>
      <div
        className={classNames("offcanvas offcanvas-start", styles.offcanvas)}
        tabIndex={-1}
        id={offcanvasId}
        aria-labelledby="filterOffcanvasLabel"
      >
        <div className={classNames("offcanvas-header", styles.offcanvasHeader)}>
          <h5 className="offcanvas-title" id="filterOffcanvasLabel">
            Filter games ({filteredCount}/{totalCount})
          </h5>
          <button
            type="button"
            className={classNames("btn-close", styles.buttonClose)}
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className={classNames("offcanvas-body", styles.offcanvasBody)}>
          <div className="row">
            <div className="col m-3">
              <input
                type="text"
                className="form-control"
                placeholder="Game name"
                value={filter.name}
                onChange={(e) => changeName(e.target.value)}
              />
            </div>
          </div>
          <Section
            title="Player count"
            value={getPlayerCountValue(filter.playerCount)}
            active={!!filter.playerCount.count}
          >
            <PlayerCount
              filter={filter.playerCount}
              onChange={changePlayerCount}
            />
          </Section>
          <Section
            title="Weight"
            value={getMinMaxValue(filter.weight.min, filter.weight.max)}
            active={!!filter.weight.min || !!filter.weight.max}
          >
            <MinMaxSliders
              min={1}
              max={5}
              step={0.1}
              onChange={changeWeight}
              value={filter.weight}
            />
          </Section>
          <Section
            title="Playing time"
            value={getMinMaxValue(
              filter.playingTime.min,
              filter.playingTime.max
            )}
            active={!!filter.playingTime.min || !!filter.playingTime.max}
          >
            <MinMaxSliders
              min={0}
              max={360}
              step={10}
              onChange={changePlayingTime}
              value={filter.playingTime}
            />
          </Section>
          <Section
            title="Collection status"
            value={getCombinedText(filter.collectionStatus)}
            active={
              filter.collectionStatus.own !== undefined ||
              filter.collectionStatus.wantToPlay !== undefined ||
              filter.collectionStatus.wishlist !== undefined
            }
          >
            <CollectionStatus
              filter={filter.collectionStatus}
              onChange={changeCollectionStatus}
            />
          </Section>
        </div>
      </div>
    </div>
  );
};

export function getMinMaxValue(min?: number, max?: number) {
  if (!min && !max) {
    return undefined;
  } else if (min && !max) {
    return `>= ${min}`;
  } else if (!min && max) {
    return `<= ${max}`;
  } else if (min === max) {
    return `= ${min}`;
  } else {
    return `${min} - ${max}`;
  }
}

export function getPlayerCountValue(
  playerCount: PlayerCountFilterOption
): string {
  if (!playerCount.count) {
    return "";
  } else if (playerCount.type === "atleast") {
    return `> ${playerCount.count}`;
  } else if (playerCount.type === "exact") {
    return `= ${playerCount.count}`;
  } else {
    return `supports ${playerCount.count}`;
  }
}

function anyFilterActive(filter: GameCollectionFilterOptions) {
  return (
    minOrMaxActive(filter.playingTime) ||
    minOrMaxActive(filter.weight) ||
    collectionStatusActive(filter.collectionStatus) ||
    !!filter.playerCount.count
  );
}

export function minOrMaxActive(filter: MinMaxFilterOption) {
  return !!filter.min || !!filter.max;
}

function collectionStatusActive(filter: CollectionStatusFilterOption) {
  return (
    filter.own !== undefined ||
    filter.wantToPlay !== undefined ||
    filter.wishlist !== undefined
  );
}

export function getEmptyFilter(): GameCollectionFilterOptions {
  return {
    name: undefined,
    weight: { min: undefined, max: undefined },
    playingTime: { min: undefined, max: undefined },
    collectionStatus: {
      own: undefined,
      wantToPlay: undefined,
      wishlist: undefined,
    },
    playerCount: {
      type: "supports",
      count: undefined,
    },
  };
}

export default GameCollectionFilter;
