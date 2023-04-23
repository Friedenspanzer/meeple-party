import classNames from "classnames";
import { useCallback, useEffect, useState } from "react";
import styles from "./gamecollectionfilter.module.css";
import validator from "validator";

export interface GameCollectionFilterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onFilterChange: (filter: GameCollectionFilterOptions) => void;
}

export interface GameCollectionFilterOptions {
  weight: {
    min?: number;
    max?: number;
  };
}

const GameCollectionFilter: React.FC<GameCollectionFilterProps> = ({
  onFilterChange,
  ...props
}) => {
  const [filter, setFilter] = useState<GameCollectionFilterOptions>({
    weight: { min: undefined, max: undefined },
  });

  useEffect(() => {
    onFilterChange(filter);
  }, [filter, onFilterChange]);

  const changeWeight = useCallback((min?: number, max?: number) => {
    setFilter((filter) => ({ ...filter, weight: { min, max } }));
  }, []);

  return (
    <div {...props} className={classNames(props.className, "container")}>
      <datalist id="markersWeight">
        <option value="0"></option>
        <option value="1"></option>
        <option value="2"></option>
        <option value="3"></option>
        <option value="4"></option>
        <option value="5"></option>
      </datalist>

      <>
        <div className="row">
          <div className="col-1">
            <button
              className="btn btn-primary"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#filterOffanvas"
              aria-controls="filterOffanvas"
            >
              <i className="bi bi-funnel-fill"></i>
            </button>
          </div>
        </div>
        <div
          className="offcanvas offcanvas-start"
          tabIndex={-1}
          id="filterOffanvas"
          aria-labelledby="filterOffcanvasLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="filterOffcanvasLabel">
              Filter games
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <div className="row">
              <div className={classNames("col-4", styles.heading)}>Weight</div>
            </div>
            <div className="row">
              <MinMaxSliders
                min={0}
                max={5}
                step={0.1}
                label="weight"
                onChange={changeWeight}
                datalist="markersWeight"
              />
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

interface MinMaxSlidersProps {
  label: string;
  onChange: (min?: number, max?: number) => void;
  min?: number;
  max?: number;
  step?: number;
  datalist?: string;
}

function MinMaxSliders({
  label,
  onChange,
  min,
  max,
  step,
  datalist,
}: MinMaxSlidersProps) {
  const [minValue, setMinValue] = useState<number>();
  const [maxValue, setMaxValue] = useState<number>();

  const changeMinValue = useCallback(
    (newValue: string) => {
      const val = validator.toFloat(newValue);
      if (maxValue && val > maxValue) {
        setMaxValue(val);
      }
      setMinValue(val);
    },
    [maxValue]
  );

  const changeMaxValue = useCallback(
    (newValue: string) => {
      const val = validator.toFloat(newValue);
      if (minValue && val < minValue) {
        setMinValue(val);
      }
      setMaxValue(val);
    },
    [minValue]
  );

  useEffect(() => {
    onChange(minValue, maxValue);
  }, [minValue, maxValue, onChange]);

  return (
    <>
      <div className="col-6">
        <label htmlFor={`sliderMin${label}`} className="form-label">
          Min{minValue !== undefined && `: ${minValue}`}
        </label>
        <input
          type="range"
          className="form-range"
          id={`sliderMin${label}`}
          min={min}
          max={max}
          step={step}
          list={datalist}
          value={minValue}
          onChange={(e) => changeMinValue(e.target.value)}
        ></input>
      </div>
      <div className="col-6">
        <label htmlFor={`sliderMax${label}`} className="form-label">
          Max{maxValue !== undefined && `: ${maxValue}`}
        </label>
        <input
          type="range"
          className="form-range"
          id={`sliderMax${label}`}
          min={min}
          max={max}
          step={step}
          list={datalist}
          value={maxValue}
          onChange={(e) => changeMaxValue(e.target.value)}
        ></input>
      </div>
    </>
  );
}

export default GameCollectionFilter;
