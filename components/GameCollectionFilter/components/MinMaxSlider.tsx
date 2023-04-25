import classNames from "classnames";
import { useCallback, useId } from "react";
import validator from "validator";
import { MinMaxFilterOption } from "../GameCollectionFilter";
import styles from "./minmaxsliders.module.css";

interface MinMaxSlidersProps {
  onChange: (values: MinMaxFilterOption) => void;
  value: MinMaxFilterOption;
  min?: number;
  max?: number;
  step?: number;
}

const MinMaxSliders: React.FC<MinMaxSlidersProps> = ({
  onChange,
  min,
  max,
  step,
  value,
}) => {
  const minId = useId();
  const maxId = useId();

  const changeMinValue = useCallback(
    (newValue: string) => {
      const val = validator.toFloat(newValue);
      const setValue = { min: value.min, max: value.max };
      if (value.max && val > value.max) {
        setValue.max = val;
      }
      setValue.min = val;
      onChange(setValue);
    },
    [value, onChange]
  );

  const changeMaxValue = useCallback(
    (newValue: string) => {
      const val = validator.toFloat(newValue);
      const setValue = { min: value.min, max: value.max };
      if (value.min && val < value.min) {
        setValue.min = val;
      }
      setValue.max = val;
      onChange(setValue);
    },
    [value, onChange]
  );

  return (
    <>
      <div className="row text-center">
        <div className={classNames("col-6", styles.value)}>
          {value.min || "-"}
        </div>
        <div className={classNames("col-6", styles.value)}>
          {value.max || "-"}
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
            value={value.min || min}
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
            value={value.max || max}
            onChange={(e) => changeMaxValue(e.target.value)}
          ></input>
        </div>
      </div>
      <div className="row text-center">
        <div className="col-6">
          <label
            htmlFor={minId}
            className={classNames("form-label", styles.label, {
              [styles.activeLabel]: !!value.min,
            })}
            onClick={() => onChange({ ...value, min: undefined })}
          >
            Min {value.min && <i className="bi bi-x-circle"></i>}
          </label>
        </div>
        <div className="col-6">
          <label
            htmlFor={maxId}
            className={classNames("form-label", styles.label, {
              [styles.activeLabel]: !!value.max,
            })}
            onClick={() => onChange({ ...value, max: undefined })}
          >
            Max {value.max && <i className="bi bi-x-circle"></i>}
          </label>
        </div>
      </div>
    </>
  );
};

export default MinMaxSliders;
