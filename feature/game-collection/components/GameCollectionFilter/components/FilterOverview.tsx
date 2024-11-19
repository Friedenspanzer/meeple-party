"use client";

import classNames from "classnames";
import {
  GameCollectionFilterOptions,
  getMinMaxValue,
  getPlayerCountTranslationKey,
  minOrMaxActive,
} from "../GameCollectionFilter";
import styles from "./filteroverview.module.css";
import { useTranslation } from "@/i18n/client";

interface FilterOverviewProps {
  filter: GameCollectionFilterOptions;
  onFilterChange: (filter: GameCollectionFilterOptions) => void;
}

const FilterOverview: React.FC<FilterOverviewProps> = ({
  filter,
  onFilterChange,
}) => {
  const { t } = useTranslation();
  return (
    <>
      {!!filter.playerCount.count && (
        <FilterPill
          filter={t("Filters.Traits.PlayerCount")}
          value={filter.playerCount.count ? t(`Filters.Values.PlayerCount.${getPlayerCountTranslationKey(filter.playerCount.type)}`, { number: filter.playerCount.count }) : ""}
          onRemove={() => {
            onFilterChange({
              ...filter,
              playerCount: {
                ...filter.playerCount,
                count: undefined,
              },
            });
          }}
        />
      )}
      {minOrMaxActive(filter.weight) && (
        <FilterPill
          filter={t("Filters.Traits.Weight")}
          value={getMinMaxValue(filter.weight.min, filter.weight.max) || ""}
          onRemove={() => {
            onFilterChange({
              ...filter,
              weight: { min: undefined, max: undefined },
            });
          }}
        />
      )}
      {minOrMaxActive(filter.playingTime) && (
        <FilterPill
          filter={t("Filters.Traits.PlayingTime")}
          value={
            getMinMaxValue(filter.playingTime.min, filter.playingTime.max) || ""
          }
          onRemove={() => {
            onFilterChange({
              ...filter,
              playingTime: { min: undefined, max: undefined },
            });
          }}
        />
      )}
      {filter.collectionStatus.own !== undefined && (
        <FilterPill
          filter={t("Filters.Traits.Own")}
          value={t(`Filters.Values.${yesNo(filter.collectionStatus.own)}`)}
          onRemove={() => {
            onFilterChange({
              ...filter,
              collectionStatus: { ...filter.collectionStatus, own: undefined },
            });
          }}
        />
      )}
      {filter.collectionStatus.wantToPlay !== undefined && (
        <FilterPill
          filter={t("Filters.Traits.WantToPlay")}
          value={t(
            `Filters.Values.${yesNo(filter.collectionStatus.wantToPlay)}`
          )}
          onRemove={() => {
            onFilterChange({
              ...filter,
              collectionStatus: {
                ...filter.collectionStatus,
                wantToPlay: undefined,
              },
            });
          }}
        />
      )}
      {filter.collectionStatus.wishlist !== undefined && (
        <FilterPill
          filter={t("Filters.Traits.Wishlist")}
          value={t(`Filters.Values.${yesNo(filter.collectionStatus.wishlist)}`)}
          onRemove={() => {
            onFilterChange({
              ...filter,
              collectionStatus: {
                ...filter.collectionStatus,
                wishlist: undefined,
              },
            });
          }}
        />
      )}
      {minOrMaxActive(filter.friends.own) && (
        <FilterPill
          filter={t("Filters.Traits.FriendsOwn")}
          value={
            getMinMaxValue(filter.friends.own.min, filter.friends.own.max) || ""
          }
          onRemove={() => {
            onFilterChange({
              ...filter,
              friends: {
                ...filter.friends,
                own: { min: undefined, max: undefined },
              },
            });
          }}
        />
      )}
      {minOrMaxActive(filter.friends.wantToPlay) && (
        <FilterPill
          filter={t("Filters.Traits.FriendsWantToPlay")}
          value={
            getMinMaxValue(
              filter.friends.wantToPlay.min,
              filter.friends.wantToPlay.max
            ) || ""
          }
          onRemove={() => {
            onFilterChange({
              ...filter,
              friends: {
                ...filter.friends,
                wantToPlay: { min: undefined, max: undefined },
              },
            });
          }}
        />
      )}
      {minOrMaxActive(filter.friends.wishlist) && (
        <FilterPill
          filter={t("Filters.Traits.FriendsWishlist")}
          value={
            getMinMaxValue(
              filter.friends.wishlist.min,
              filter.friends.wishlist.max
            ) || ""
          }
          onRemove={() => {
            onFilterChange({
              ...filter,
              friends: {
                ...filter.friends,
                wishlist: { min: undefined, max: undefined },
              },
            });
          }}
        />
      )}
    </>
  );
};

function FilterPill({
  filter,
  value,
  onRemove,
}: {
  filter: string;
  value: string;
  onRemove: () => void;
}) {
  return (
    <div
      className={classNames("badge rounded-pill", styles.pill)}
      onClick={() => {
        onRemove();
      }}
    >
      <div
        className={classNames(styles.title, "text-bg-primary")}
        onClick={() => {
          onRemove();
        }}
      >
        <i className="bi bi-x-circle"></i> {filter}
      </div>
      <div className={classNames(styles.value, "text-bg-light")}>{value}</div>
    </div>
  );
}

function yesNo(b: boolean) {
  if (b) {
    return "Yes";
  } else {
    return "No";
  }
}

export default FilterOverview;
