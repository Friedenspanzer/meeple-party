import classNames from "classnames";
import {
  GameCollectionFilterOptions,
  getMinMaxValue,
  minOrMaxActive,
} from "../GameCollectionFilter";
import styles from "./filteroverview.module.css";

interface FilterOverviewProps {
  filter: GameCollectionFilterOptions;
  onFilterChange: (filter: GameCollectionFilterOptions) => void;
}

const FilterOverview: React.FC<FilterOverviewProps> = ({
  filter,
  onFilterChange,
}) => {
  return (
    <>
      {minOrMaxActive(filter.weight) && (
        <FilterPill
          filter="Weight"
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
          filter="Playing time"
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
      onClick={(_) => {
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

export default FilterOverview;
