import { useCallback, useEffect, useId, useState } from "react";
import validator from "validator";

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
    <div className="row">
      <div className="col-6">
          Min{minValue !== undefined && `: ${minValue}`}
        <label htmlFor={minId} className="form-label">
        </label>
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
          Max{maxValue !== undefined && `: ${maxValue}`}
        <label htmlFor={maxId} className="form-label">
        </label>
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
  );
};

export default MinMaxSliders;
