"use client";

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
import Group from "./components/Group";
import { emptyFilter } from "@/utility/filter";

export interface GameCollectionFilterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onFilterChange: (filter: GameCollectionFilterOptions) => void;
  defaultFilter?: GameCollectionFilterOptions;
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

export type FriendCollectionFilterOptions = {
  own: MinMaxFilterOption;
  wantToPlay: MinMaxFilterOption;
  wishlist: MinMaxFilterOption;
};

const sortOrderOptions = [
  "name",
  "minPlayers",
  "maxPlayers",
  "weight",
  "playingTime",
  "collectionStatus",
  "friendsOwn",
  "friendsWantToPlay",
  "friendsWish",
] as const;
export type SortOrder = (typeof sortOrderOptions)[number];

export interface GameCollectionFilterOptions {
  name?: string;
  weight: MinMaxFilterOption;
  playingTime: MinMaxFilterOption;
  collectionStatus: CollectionStatusFilterOption;
  playerCount: PlayerCountFilterOption;
  friends: FriendCollectionFilterOptions;
  sort: SortOrder;
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
  defaultFilter,
  ...props
}) => {
  const offcanvasId = useId();

  const [filter, setFilter] = useState<GameCollectionFilterOptions>(
    defaultFilter || emptyFilter
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

  const changeFriendsOwn = useCallback((own: MinMaxFilterOption) => {
    setFilter((filter) => ({ ...filter, friends: { ...filter.friends, own } }));
  }, []);

  const changeFriendsWantToPlay = useCallback(
    (wantToPlay: MinMaxFilterOption) => {
      setFilter((filter) => ({
        ...filter,
        friends: { ...filter.friends, wantToPlay },
      }));
    },
    []
  );

  const changeFriendsWishlist = useCallback((wishlist: MinMaxFilterOption) => {
    setFilter((filter) => ({
      ...filter,
      friends: { ...filter.friends, wishlist },
    }));
  }, []);

  const changeSortOrder = useCallback((sort: SortOrder) => {
    setFilter((filter) => ({ ...filter, sort }));
  }, []);

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
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Game name"
            value={filter.name}
            onChange={(e) => changeName(e.target.value)}
          />
        </div>
        <div className="col-md-5">
          <FilterOverview
            filter={filter}
            onFilterChange={(filter) => setFilter(filter)}
          />
        </div>
        <div className="col-md-3">
          <div className="dropdown">
            <button
              className={classNames(
                "btn btn-primary dropdown-toggle",
                styles.sortButton
              )}
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-sort-down-alt"></i>{" "}
              {sortOrderDescription(filter.sort)}
            </button>
            <ul className="dropdown-menu">
              {sortOrderOptions.map((option) => (
                <li key={option}>
                  <button
                    className="dropdown-item"
                    onClick={() => changeSortOrder(option)}
                  >
                    {sortOrderDescription(option)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
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
          <Group title="Game attributes">
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
              <div className="row">
                <div className="col">
                  <WeightPresets
                    weightFilter={filter.weight}
                    onChange={changeWeight}
                  />
                </div>
              </div>
              <MinMaxSliders
                min={1}
                max={5}
                step={0.1}
                onChange={changeWeight}
                value={filter.weight}
              />
            </Section>
            <MinMaxSection
              minMax={filter.playingTime}
              changeFunction={changePlayingTime}
              title="Playing time"
              min={0}
              max={360}
              step={10}
            />
          </Group>
          <Group title="Your collection">
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
          </Group>
          <Group title="Your friends">
            <MinMaxSection
              minMax={filter.friends.own}
              changeFunction={changeFriendsOwn}
              title="Friends own"
              max={25}
            />
            <MinMaxSection
              minMax={filter.friends.wantToPlay}
              changeFunction={changeFriendsWantToPlay}
              title="Friends want to play"
              max={25}
            />
            <MinMaxSection
              minMax={filter.friends.wishlist}
              changeFunction={changeFriendsWishlist}
              title="Friends wish"
              max={25}
            />
          </Group>
        </div>
      </div>
    </div>
  );
};

function MinMaxSection({
  minMax,
  changeFunction,
  title,
  max,
  min = 0,
  step = 1,
}: {
  minMax: MinMaxFilterOption;
  changeFunction: (minMax: MinMaxFilterOption) => void;
  title: string;
  max: number;
  min?: number;
  step?: number;
}) {
  return (
    <Section
      title={title}
      value={getMinMaxValue(minMax.min, minMax.max)}
      active={!!minMax.min || !!minMax.max}
    >
      <MinMaxSliders
        min={min}
        max={max}
        step={step}
        onChange={changeFunction}
        value={minMax}
      />
    </Section>
  );
}

function WeightPresets({
  weightFilter,
  onChange,
}: {
  weightFilter: MinMaxFilterOption;
  onChange: (weight: MinMaxFilterOption) => void;
}) {
  return (
    <div
      className="btn-group btn-group-sm"
      role="group"
      aria-label="Basic example"
    >
      <button
        type="button"
        className={classNames("btn", styles.weightPresetButtons, {
          "btn-primary": isLight(weightFilter),
          "btn-outline-primary": !isLight(weightFilter),
        })}
        onClick={() => onChange({ max: 1.5, min: undefined })}
      >
        Light
      </button>
      <button
        type="button"
        className={classNames("btn", styles.weightPresetButtons, {
          "btn-primary": isMediumLight(weightFilter),
          "btn-outline-primary": !isMediumLight(weightFilter),
        })}
        onClick={() => onChange({ min: 1.5, max: 2.5 })}
      >
        Medium Light
      </button>
      <button
        type="button"
        className={classNames("btn", styles.weightPresetButtons, {
          "btn-primary": isMedium(weightFilter),
          "btn-outline-primary": !isMedium(weightFilter),
        })}
        onClick={() => onChange({ min: 2.5, max: 3.5 })}
      >
        Medium
      </button>
      <button
        type="button"
        className={classNames("btn", styles.weightPresetButtons, {
          "btn-primary": isMediumHeavy(weightFilter),
          "btn-outline-primary": !isMediumHeavy(weightFilter),
        })}
        onClick={() => onChange({ min: 3.5, max: 4.5 })}
      >
        Medium Heavy
      </button>
      <button
        type="button"
        className={classNames("btn", styles.weightPresetButtons, {
          "btn-primary": isHeavy(weightFilter),
          "btn-outline-primary": !isHeavy(weightFilter),
        })}
        onClick={() => onChange({ min: 4.5, max: undefined })}
      >
        Heavy
      </button>
    </div>
  );
}

function isLight(weightFilter: MinMaxFilterOption) {
  return weightFilter.max && weightFilter.max === 1.5;
}

function isMediumLight(weightFilter: MinMaxFilterOption) {
  return (
    weightFilter.min &&
    weightFilter.max &&
    weightFilter.min === 1.5 &&
    weightFilter.max === 2.5
  );
}

function isMedium(weightFilter: MinMaxFilterOption) {
  return (
    weightFilter.min &&
    weightFilter.max &&
    weightFilter.min === 2.5 &&
    weightFilter.max === 3.5
  );
}

function isMediumHeavy(weightFilter: MinMaxFilterOption) {
  return (
    weightFilter.min &&
    weightFilter.max &&
    weightFilter.min === 3.5 &&
    weightFilter.max === 4.5
  );
}

function isHeavy(weightFilter: MinMaxFilterOption) {
  return weightFilter.min && weightFilter.min === 4.5;
}

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
    friendCollectionStatusActive(filter.friends) ||
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

function friendCollectionStatusActive(filter: FriendCollectionFilterOptions) {
  return (
    minOrMaxActive(filter.own) ||
    minOrMaxActive(filter.wantToPlay) ||
    minOrMaxActive(filter.wishlist)
  );
}

function sortOrderDescription(sortOrder: SortOrder): string {
  switch (sortOrder) {
    case "collectionStatus":
      return "Collection status";
    case "friendsOwn":
      return "Friends owning";
    case "friendsWantToPlay":
      return "Friends want to play";
    case "friendsWish":
      return "Friends wish";
    case "maxPlayers":
      return "Max players";
    case "minPlayers":
      return "Min players";
    case "name":
      return "Name";
    case "playingTime":
      return "Playing time";
    case "weight":
      return "Weight";
  }
}

export default GameCollectionFilter;
