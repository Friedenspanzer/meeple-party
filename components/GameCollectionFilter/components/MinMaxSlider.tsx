import { useCallback, useEffect, useState } from "react";
import validator from "validator";

interface MinMaxSlidersProps {
  label: string;
  onChange: (min?: number, max?: number) => void;
  min?: number;
  max?: number;
  step?: number;
  datalist?: string;
}

const MinMaxSliders: React.FC<MinMaxSlidersProps> = ({
  label,
  onChange,
  min,
  max,
  step,
  datalist,
}) => {
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
    <div className="row">
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
    </div>
  );
};

export default MinMaxSliders;
