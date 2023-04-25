import classNames from "classnames";
import { useCallback, useEffect, useId, useState } from "react";
import styles from "./gamecollectionfilter.module.css";
import MinMaxSliders from "./components/MinMaxSlider";
import Section from "./components/Section";
import FilterOverview from "./components/FilterOverview";

export interface GameCollectionFilterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onFilterChange: (filter: GameCollectionFilterOptions) => void;
  totalCount: number;
  filteredCount: number;
}

export type MinMaxFilterOption = {
  min?: number;
  max?: number;
};

export interface GameCollectionFilterOptions {
  name?: string;
  weight: MinMaxFilterOption;
  playingTime: MinMaxFilterOption;
}

const GameCollectionFilter: React.FC<GameCollectionFilterProps> = ({
  onFilterChange,
  totalCount,
  filteredCount,
  ...props
}) => {
  const offcanvasId = useId();

  const [filter, setFilter] = useState<GameCollectionFilterOptions>({
    weight: { min: undefined, max: undefined },
    playingTime: { min: undefined, max: undefined },
  });

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

  return (
    <div {...props} className={classNames(props.className, "container")}>
      <div className="row">
        <div className="col-1">
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
        </div>
        <div className="col-4">
          <input
            type="text"
            className="form-control"
            placeholder="Game name"
            value={filter.name}
            onChange={(e) => changeName(e.target.value)}
          />
        </div>
        <div className="col-7">
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

function anyFilterActive(filter: GameCollectionFilterOptions) {
  return minOrMaxActive(filter.playingTime) || minOrMaxActive(filter.weight);
}

export function minOrMaxActive(filter: MinMaxFilterOption) {
  return !!filter.min || !!filter.max;
}

export default GameCollectionFilter;
