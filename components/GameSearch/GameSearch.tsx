"use client";

import { ExtendedGameCollection } from "@/datatypes/collection";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import Spinner from "../Spinner/Spinner";
import styles from "./gamesearch.module.css";

export interface GameSearchChildren {
  searchResult: ExtendedGameCollection[];
}

export interface GameSearchProps {
  resultView: React.FC<GameSearchChildren>;
}

const GameSearch: React.FC<GameSearchProps> = ({ resultView }) => {
  const [term, setTerm] = useState<string>("");
  const [result, setResult] = useState<ExtendedGameCollection[]>([]);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState(false);

  const [debouncedTerm] = useDebounce(term, 500);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    setError(false);
    if (!debouncedTerm || debouncedTerm.length === 0) {
      setResult([]);
      setDirty(false);
    } else {
      fetch(`/api/games/search/${debouncedTerm}`, { signal })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw Error(`${response.status} ${response.statusText}`);
          }
        })
        .then(setResult)
        .catch(() => {
          setResult([]);
          setError(true);
        })
        .finally(() => setDirty(false));
    }
    return () => {
      if (controller) {
        controller.abort();
      }
    };
  }, [debouncedTerm]);

  return (
    <>
      <div className={styles.container}>
        <input
          type="text"
          className={classNames([
            "form-control",
            styles.search,
            { dirty: dirty },
          ])}
          id="profileName"
          placeholder="Game name, BoardGameGeek ID, BoardGameGeek Link, ..."
          aria-describedby="profileNameHelp"
          value={term ?? ""}
          onChange={(e) => {
            setDirty(true);
            setTerm(e.currentTarget.value);
          }}
        />
        {dirty && <Spinner size="small" />}
      </div>
      {!dirty && !error && result && resultView({ searchResult: result })}
      {error && (
        <div className="alert alert-danger col-md-6" role="alert">
          <h4>
            <i className="bi bi-exclamation-octagon-fill"></i> Error during game
            search
          </h4>
          Please try again later. If this persists please contact your
          administrator.
        </div>
      )}
      {!dirty && !error && result.length === 0 && (
        <div className="alert alert-info col-md-6" role="alert">
          <i className="bi bi-binoculars-fill"></i> No results found
        </div>
      )}
    </>
  );
};

export default GameSearch;
