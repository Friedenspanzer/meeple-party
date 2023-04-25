import classNames from "classnames";
import { useCallback, useId } from "react";
import validator from "validator";
import { PlayerCountFilterOption } from "../GameCollectionFilter";
import styles from "./playercount.module.css";

export interface PlayerCountProps {
  filter: PlayerCountFilterOption;
  onChange: (filter: PlayerCountFilterOption) => void;
}

const PlayerCount: React.FC<PlayerCountProps> = ({ filter, onChange }) => {
  const setType = useCallback(
    (type: "exact" | "supports" | "atleast") => {
      onChange({ ...filter, type });
    },
    [filter, onChange]
  );

  const changePlayerCount = useCallback(
    (newValue: string) => {
      const val = validator.toInt(newValue);
      onChange({ ...filter, count: val });
    },
    [filter, onChange]
  );

  const reset = useCallback(() => {
    onChange({ ...filter, count: undefined });
  }, [filter, onChange]);

  const rangeId = useId();

  return (
    <>
      <div className="row text-center">
        <div className={classNames("col", styles.value)}>
          {filter.count || "-"}
        </div>
      </div>
      <div className="row text-center">
        <div className="col">
          <input
            type="range"
            className="form-range"
            id={rangeId}
            min={1}
            max={16}
            step={1}
            value={filter.count || "2"}
            onChange={(e) => changePlayerCount(e.target.value)}
          ></input>
        </div>
      </div>
      <div className="row text-center align-items-center">
        <div className="col-11">
          <div
            className="btn-group btn-group-sm"
            role="group"
            aria-label="Basic example"
          >
            <button
              type="button"
              className={classNames("btn", {
                "btn-primary": filter.type === "supports",
                "btn-outline-primary": filter.type !== "supports",
              })}
              onClick={() => setType("supports")}
            >
              Supports
            </button>
            <button
              type="button"
              className={classNames("btn", {
                "btn-primary": filter.type === "atleast",
                "btn-outline-primary": filter.type !== "atleast",
              })}
              onClick={() => setType("atleast")}
            >
              At least
            </button>
            <button
              type="button"
              className={classNames("btn", {
                "btn-primary": filter.type === "exact",
                "btn-outline-primary": filter.type !== "exact",
              })}
              onClick={() => setType("exact")}
            >
              Exact
            </button>
          </div>
        </div>
        <div className="col-1">
          {filter.count && (
            <i
              className={classNames("bi bi-x-circle", styles.clickable)}
              onClick={reset}
            ></i>
          )}
        </div>
      </div>
    </>
  );
};

export default PlayerCount;
