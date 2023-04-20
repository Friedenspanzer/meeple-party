"use client";

import {
  CollectionUpdate,
  CollectionStatus,
} from "@/pages/api/collection/[gameId]";
import { useEffect, useState } from "react";
import { ImportConfiguration } from "../page";
import validator from "validator";
import { Game, GameCollection } from "@prisma/client";
import styles from "./import.module.css";
import CollectionChange from "@/components/CollectionChange/CollectionChange";
import CriticalError from "@/components/CriticalError/CriticalError";

export interface ImportProps {
  configuration: ImportConfiguration;
  bggObject: any;
}

export interface ImportStepDefinition {
  text: string;
  lists: {
    wishlist: boolean;
    wantToPlay: boolean;
    own: boolean;
  };
  operation: "add" | "remove" | "change";
  image: string | null;
}

type GameCollectionFromDatabase = GameCollection & {
  game: Game;
};

interface GameCollectionStatus extends CollectionStatus {
  gameId: number;
}

const Import: React.FC<ImportProps> = ({ configuration, bggObject }) => {
  const [itemsToImport, setItemsToImport] = useState<GameCollectionStatus[]>(
    []
  );
  const [currentCollection, setCurrentCollection] =
    useState<GameCollectionStatus[]>();
  const [importSteps, setImportSteps] = useState<ImportStepDefinition[]>([]);
  const [totalNumberOfImports, setTotalNumberOfImports] = useState(0);

  const [error, setError] = useState<string | false>(false);
  const [errorDetail, setErrorDetail] = useState<string>();

  useEffect(() => {
    async function readCollections() {
      const currentCollection: GameCollectionStatus[] = await fetch(
        "/api/collection"
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            setError(`Error loading collection data.`);
            setErrorDetail(`${response.status} ${response.statusText}`);
          }
        })
        .then((collection) =>
          collection.map((c: GameCollectionFromDatabase) => ({
            gameId: c.gameId,
            own: c.own,
            wantToPlay: c.wantToPlay,
            wishlist: c.wishlist,
          }))
        );

      const bggCollection: GameCollectionStatus[] = bggObject.items.item.map(
        (i: any) => ({
          gameId: validator.toInt(i["@_objectid"]),
          own: i.status["@_own"] === "1",
          wantToPlay: i.status["@_wanttoplay"] === "1",
          wishlist:
            i.status["@_wishlist"] === "1" || i.status["@_wanttobuy"] === "1",
        })
      );

      setCurrentCollection(currentCollection);
      const changeSet = mergeToChangeset(currentCollection, bggCollection);
      setTotalNumberOfImports(changeSet.length);
      setItemsToImport(changeSet);
    }
    readCollections();
  }, [bggObject.items.item]);

  useEffect(() => {
    async function importNext(
      toImport: GameCollectionStatus[],
      current: GameCollectionStatus[]
    ) {
      const [head, ...tail] = toImport;
      setItemsToImport(tail);
      const importStep = await changeCollectionStatus(head, current);
      if (importStep) {
        setImportSteps((i) => [...i, importStep]);
      }
    }
    if (currentCollection && itemsToImport.length > 0) {
      setTimeout(() => importNext(itemsToImport, currentCollection), 500);
    }
  }, [itemsToImport, currentCollection]);

  return (
    <>
      {error && <CriticalError message={error} details={errorDetail} />}
      <div
        className="progress"
        role="progressbar"
        aria-label="Number of games to import"
        aria-valuenow={itemsToImport.length}
        aria-valuemin={0}
        aria-valuemax={totalNumberOfImports}
      >
        <div
          className="progress-bar"
          style={{
            width: `${
              totalNumberOfImports > 0
                ? ((totalNumberOfImports - itemsToImport.length) /
                    totalNumberOfImports) *
                  100
                : 100
            }%`,
          }}
        >
          {totalNumberOfImports - itemsToImport.length} / {totalNumberOfImports}
          {totalNumberOfImports === 0 && " - Nothing to import"}
        </div>
      </div>
      <div className={styles.importSteps}>
        {[...importSteps].reverse().map((s) => (
          <CollectionChange
            key={s.text}
            operation={s.operation}
            image={s.image!}
            text={s.text}
            own={s.lists.own}
            wantToPlay={s.lists.wantToPlay}
            wishlist={s.lists.wishlist}
          />
        ))}
      </div>
    </>
  );
};

export default Import;

async function changeCollectionStatus(
  newStatus: GameCollectionStatus,
  currentCollection: GameCollectionStatus[]
): Promise<ImportStepDefinition | undefined> {
  if (newStatus.own || newStatus.wantToPlay || newStatus.wishlist) {
    const result: CollectionUpdate = await fetch(
      `/api/collection/${newStatus.gameId}`,
      {
        method: "POST",
        body: JSON.stringify({
          own: newStatus.own,
          wantToPlay: newStatus.wantToPlay,
          wishlist: newStatus.wishlist,
        } as CollectionStatus),
      }
    ).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(`${response.status} ${response.statusText}`);
      }
    });
    if (!result.success) {
      return;
    }
    return createImportStep(result, currentCollection);
  }
}

function createImportStep(
  collectionUpdate: CollectionUpdate,
  currentCollection: GameCollectionStatus[]
): ImportStepDefinition | undefined {
  const current = currentCollection.find(
    (c) => c.gameId === collectionUpdate.game.id
  );
  if (current) {
    return {
      operation: "change",
      lists: {
        wishlist: !!collectionUpdate.status.wishlist && !current.wishlist,
        wantToPlay: !!collectionUpdate.status.wantToPlay && !current.wantToPlay,
        own: !!collectionUpdate.status.own && !current.own,
      },
      text: `${collectionUpdate.game.name} updated in your collection.`,
      image: collectionUpdate.game.thumbnail,
    };
  } else {
    return {
      operation: "add",
      lists: {
        wishlist: !!collectionUpdate.status.wishlist,
        wantToPlay: !!collectionUpdate.status.wantToPlay,
        own: !!collectionUpdate.status.own,
      },
      text: `${collectionUpdate.game.name} added to your collection.`,
      image: collectionUpdate.game.thumbnail,
    };
  }
}

function mergeToChangeset(
  currentCollection: GameCollectionStatus[],
  bggCollection: GameCollectionStatus[]
): GameCollectionStatus[] {
  const changeSet: GameCollectionStatus[] = [];
  bggCollection.forEach((bgg) => {
    const current = currentCollection.find((c) => c.gameId === bgg.gameId);
    if (!current) {
      if (bgg.own || bgg.wishlist || bgg.wantToPlay) {
        changeSet.push({ ...bgg });
      }
    } else if (
      (bgg.own && !current.own) ||
      (bgg.wantToPlay && !current.wantToPlay) ||
      (bgg.wishlist && !current.wishlist)
    ) {
      changeSet.push({
        gameId: bgg.gameId,
        own: bgg.own,
        wantToPlay: bgg.wantToPlay,
        wishlist: bgg.wishlist,
      });
    }
  });
  return changeSet;
}
