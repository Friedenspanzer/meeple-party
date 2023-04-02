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

  const [debouncedTerm] = useDebounce(term, 500);

  useEffect(() => {
    if (!debouncedTerm || debouncedTerm.length === 0) {
      setResult([]);
      setDirty(false);
    } else {
      //TODO Better error handling
      fetch(`/api/games/search/${debouncedTerm}`)
        .then((response) => response.json())
        .then(setResult)
        .then(() => setDirty(false));
    }
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
      {!dirty && !!result && resultView({ searchResult: result })}
    </>
  );
};

export default GameSearch;
