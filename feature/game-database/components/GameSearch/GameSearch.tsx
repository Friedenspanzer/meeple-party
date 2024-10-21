"use client";

import { useTranslation } from "@/i18n/client";
import { ExtendedGameCollection } from "@/lib/types/collection";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import Spinner from "../../../../lib/components/Spinner/Spinner";
import styles from "./gamesearch.module.css";

export interface GameSearchChildren {
  searchResult: ExtendedGameCollection[];
}

export interface GameSearchProps {
  resultView: React.FC<GameSearchChildren>;
}

const GameSearch: React.FC<GameSearchProps> = ({ resultView }) => {
  const { t } = useTranslation();
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
            console.error(`${response.status} ${response.statusText}`);
            setResult([]);
            setError(true);
          }
        })
        .then((result: ExtendedGameCollection[]) =>
          result.sort(searchResultSortOrder)
        )
        .then(setResult)
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
          placeholder={t("Search.Placeholder")}
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
            <i className="bi bi-exclamation-octagon-fill"></i> {t("Search.Error.Title")}
          </h4>
          {t("Search.Error.Text")}
        </div>
      )}
      {!dirty && !error && term.length > 0 && result.length === 0 && (
        <div className="alert alert-info col-md-6" role="alert">
          <i className="bi bi-binoculars-fill"></i> {t("Search.NoResults")}
        </div>
      )}
    </>
  );
};

function searchResultSortOrder(
  a: ExtendedGameCollection,
  b: ExtendedGameCollection
): number {
  if (!a.game.BGGRank && b.game.BGGRank) {
    return 1;
  } else if (a.game.BGGRank && !b.game.BGGRank) {
    return -1;
  } else if (!a.game.BGGRank && !b.game.BGGRank) {
    return a.game.name.localeCompare(b.game.name);
  } else {
    return a.game.BGGRank! - b.game.BGGRank!;
  }
}

export default GameSearch;
