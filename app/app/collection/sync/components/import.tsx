import {
  CollectionUpdate,
  CollectionStatus,
} from "@/pages/api/database/collection/[gameId]";
import { useEffect, useState } from "react";
import { ImportConfiguration, ImportStep } from "../page";
import ImportSteps from "./importSteps";

export interface ImportProps {
  configuration: ImportConfiguration;
  bggObject: any;
  onDone: () => void;
}

const Import: React.FC<ImportProps> = (props) => {
  const [itemsToImport, setItemsToImport] = useState(
    props.bggObject.items.item
  );
  const [toImport] = useState(itemsToImport.length);
  const [importSteps, setImportSteps] = useState<ImportStep[]>([]);

  useEffect(() => {
    //TODO Check if entries are already in sync before updating
    async function importNext() {
      const [head, ...tail] = itemsToImport;
      const gameId = head["@_objectid"];
      const own = head.status["@_own"] === "1";
      const wantToPlay = head.status["@_wanttoplay"] === "1";
      const wishlist = head.status["@_wishlist"] === "1";
      console.log(gameId, own, wantToPlay, wishlist);
      const newImportSteps = await changeCollectionStatus(
        gameId,
        own,
        wantToPlay,
        wishlist
      );
      if (!!newImportSteps) {
        setImportSteps((prev) => [...prev, ...newImportSteps]);
      }
      setItemsToImport(tail);
    }
    if (!!itemsToImport && itemsToImport.length > 0) {
      importNext();
    }
  }, [itemsToImport]);

  return (
    <>
      <div
        className="progress"
        role="progressbar"
        aria-label="Number of games to import"
        aria-valuenow={itemsToImport.length}
        aria-valuemin={0}
        aria-valuemax={toImport}
      >
        <div
          className="progress-bar"
          style={{
            width: `${((toImport - itemsToImport.length) / toImport) * 100}%`,
          }}
        >
          {toImport - itemsToImport.length} / {toImport}
        </div>
      </div>
      <ImportSteps steps={importSteps} />
    </>
  );
};

export default Import;

async function changeCollectionStatus(
  gameId: number,
  own: boolean,
  wishlist: boolean,
  wantToPlay: boolean
): Promise<ImportStep[] | undefined> {
  if (own || wantToPlay || wishlist) {
    //TODO Better error handling
    const result: CollectionUpdate = await fetch(
      `/api/database/collection/${gameId}`,
      {
        method: "POST",
        body: JSON.stringify({
          own,
          wishlist,
          wantToPlay,
        } as CollectionStatus),
      }
    ).then((response) => response.json());
    if (!result.success) {
      return;
    }
    const ret: ImportStep[] = [];
    if (result.status.own) {
      ret.push({
        text: `${result.game.name} added to your collection.`,
        operation: "added",
        image: result.game.image,
      });
    }
    if (result.status.wishlist) {
      ret.push({
        text: `${result.game.name} added to your wishlist.`,
        operation: "added",
        image: result.game.image,
      });
    }
    if (result.status.wantToPlay) {
      ret.push({
        text: `${result.game.name} added to your want to play games.`,
        operation: "added",
        image: result.game.image,
      });
    }
    return ret;
  }
  return;
}
