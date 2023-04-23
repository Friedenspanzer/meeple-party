import classNames from "classnames";
import { useCallback, useEffect, useId, useState } from "react";
import styles from "./gamecollectionfilter.module.css";
import MinMaxSliders from "./components/MinMaxSlider";
import Section from "./components/Section";

export interface GameCollectionFilterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onFilterChange: (filter: GameCollectionFilterOptions) => void;
}

type MinMaxFilterOption = {
  min?: number;
  max?: number;
};

export interface GameCollectionFilterOptions {
  weight: MinMaxFilterOption;
  playingTime: MinMaxFilterOption;
}

const GameCollectionFilter: React.FC<GameCollectionFilterProps> = ({
  onFilterChange,
  ...props
}) => {
  const id = useId();

  const [filter, setFilter] = useState<GameCollectionFilterOptions>({
    weight: { min: undefined, max: undefined },
    playingTime: { min: undefined, max: undefined },
  });

  useEffect(() => {
    onFilterChange(filter);
  }, [filter, onFilterChange]);

  const changeWeight = useCallback((min?: number, max?: number) => {
    setFilter((filter) => ({ ...filter, weight: { min, max } }));
  }, []);

  const changePlayingTime = useCallback((min?: number, max?: number) => {
    setFilter((filter) => ({ ...filter, playingTime: { min, max } }));
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
            data-bs-target={`#${id}`}
            aria-controls={id}
          >
            <i className="bi bi-funnel-fill"></i>
          </button>
        </div>
      </div>
      <div
        className={classNames("offcanvas offcanvas-start", styles.offcanvas)}
        tabIndex={-1}
        id={id}
        aria-labelledby="filterOffcanvasLabel"
      >
        <div className={classNames("offcanvas-header", styles.offcanvasHeader)}>
          <h5 className="offcanvas-title" id="filterOffcanvasLabel">
            Filter games
          </h5>
          <button
            type="button"
            className={classNames("btn-close", styles.buttonClose)}
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className={classNames("offcanvas-body", styles.offcanvasBody)}>
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
              datalist="markersWeight"
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
            />
          </Section>
        </div>
      </div>
    </div>
  );
};

function getMinMaxValue(min?: number, max?: number) {
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

function minOrMaxActive(filter: MinMaxFilterOption) {
  return !!filter.min || !!filter.max;
}

export default GameCollectionFilter;
