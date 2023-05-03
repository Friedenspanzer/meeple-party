"use client";

import { useUser } from "@/context/userContext";
import { UserPreferences } from "@/datatypes/userProfile";
import classNames from "classnames";
import { useCallback, useId, useState } from "react";
import Spinner from "../Spinner/Spinner";
import styles from "./autoupdatetoggle.module.css";

export interface AutoUpdateToggleProps {
  value: boolean;
  onChange: (value: boolean) => Partial<UserPreferences>;
  title: string;
  children?: React.ReactNode;
}

const AutoUpdateToggle: React.FC<AutoUpdateToggleProps> = ({
  value,
  onChange,
  title,
  children,
}) => {
  const switchId = useId();
  const [checked, setChecked] = useState(value);
  const [dirty, setDirty] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const { update: updateUser } = useUser();

  const updateValue = useCallback(
    (newValue: boolean) => {
      setSuccess(false);
      setError(false);
      setDirty(true);
      setChecked(newValue);
      const preferences = onChange(newValue);
      fetch("/api/user", {
        method: "PATCH",
        body: JSON.stringify({ preferences }),
      }).then((response) => {
        if (response.ok) {
          setSuccess(true);
          setDirty(false);
          updateUser();
        } else {
          setChecked(!newValue);
          setDirty(false);
          setError(true);
        }
      });
    },
    [onChange, updateUser]
  );

  return (
    <div className="row">
      <div className="col-md-1 text-md-end">
        {dirty && <Spinner size="small" />}
        {success && (
          <i
            className={classNames(
              "bi bi-check-circle-fill",
              styles.status,
              styles.success
            )}
          ></i>
        )}
        {error && (
          <i
            className={classNames(
              "bi bi-x-circle-fill",
              styles.status,
              styles.error
            )}
          ></i>
        )}
      </div>
      <div className="col-1">
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id={switchId}
            checked={checked}
            onChange={(e) => updateValue(e.currentTarget.checked)}
            disabled={dirty}
          />
        </div>
      </div>
      <div className="col-10">
        <label className="form-check-label" htmlFor={switchId}>
          <h4>{title}</h4>
        </label>
        {children}
      </div>
    </div>
  );
};

export default AutoUpdateToggle;
