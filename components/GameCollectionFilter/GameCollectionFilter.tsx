import classNames from "classnames";
import { useCallback, useEffect, useId, useState } from "react";
import styles from "./gamecollectionfilter.module.css";
import validator from "validator";
import MinMaxSliders from "./components/MinMaxSlider";
import Section from "./components/Section";

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
  const id = useId();

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
          <div
            className={classNames("offcanvas-header", styles.offcanvasHeader)}
          >
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
            <Section title="Weight">
              <MinMaxSliders
                min={0}
                max={5}
                step={0.1}
                label="weight"
                onChange={changeWeight}
                datalist="markersWeight"
              />
            </Section>
          </div>
        </div>
      </>
    </div>
  );
};

export default GameCollectionFilter;
