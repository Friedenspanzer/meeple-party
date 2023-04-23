import classNames from "classnames";
import { useCallback, useEffect, useId, useState } from "react";
import validator from "validator";
import styles from "./minmaxsliders.module.css";

interface MinMaxSlidersProps {
  onChange: (min?: number, max?: number) => void;
  min?: number;
  max?: number;
  step?: number;
  datalist?: string;
}

const MinMaxSliders: React.FC<MinMaxSlidersProps> = ({
  onChange,
  min,
  max,
  step,
  datalist,
}) => {
  const [minValue, setMinValue] = useState<number>();
  const [maxValue, setMaxValue] = useState<number>();

  const minId = useId();
  const maxId = useId();

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
      <div className="row text-center">
        <div className={classNames("col-6", styles.value)}>
          {minValue || "-"}
        </div>
        <div className={classNames("col-6", styles.value)}>
          {maxValue || "-"}
        </div>
      </div>
      <div className="row text-center">
        <div className="col-6">
          <input
            type="range"
            className="form-range"
            id={minId}
            min={min}
            max={max}
            step={step}
            list={datalist}
            value={minValue || min}
            onChange={(e) => changeMinValue(e.target.value)}
          ></input>
        </div>
        <div className="col-6">
          <input
            type="range"
            className="form-range"
            id={maxId}
            min={min}
            max={max}
            step={step}
            list={datalist}
            value={maxValue || max}
            onChange={(e) => changeMaxValue(e.target.value)}
          ></input>
        </div>
      </div>
      <div className="row text-center">
        <div className="col-6">
          <label
            htmlFor={minId}
            className={classNames("form-label", styles.label, {
              [styles.activeLabel]: !!minValue,
            })}
            onClick={() => setMinValue(undefined)}
          >
            Min {minValue && <i className="bi bi-x-circle"></i>}
          </label>
        </div>
        <div className="col-6">
          <label
            htmlFor={maxId}
            className={classNames("form-label", styles.label, {
              [styles.activeLabel]: !!maxValue,
            })}
            onClick={() => setMaxValue(undefined)}
          >
            Max {maxValue && <i className="bi bi-x-circle"></i>}
          </label>
        </div>
      </div>
    </>
  );
};

export default MinMaxSliders;
