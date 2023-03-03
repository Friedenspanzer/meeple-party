"use client";

import { UserContext } from "@/context/userContext";
import {
  CollectionStatus,
  CollectionUpdate,
} from "@/pages/api/database/collection/[gameId]";
import { XMLParser } from "fast-xml-parser";
import { useContext, useEffect, useState } from "react";
import styles from "./sync.module.css";
import Image from "next/image";

type Step = "username" | "type" | "request" | "import" | "done";

interface ImportStep {
  text: string;
  operation: "added" | "removed" | "changed";
  image: string | null;
}

const xmlParser = new XMLParser({
  ignoreAttributes: false,
});

export default function CollectionSyncPage() {
  const userProfile = useContext(UserContext);
  const [step, setStep] = useState<Step>("username");
  const [loading, setLoading] = useState(false);
  const [bggName, setBggName] = useState(userProfile.bggName);
  const [importSteps, setImportSteps] = useState<ImportStep[]>([]);
  const [importProgress, setImportProgress] = useState(0);
  const [toImport, setToImport] = useState(0);
  const [itemsToImport, setItemsToImport] = useState<any>(undefined);

  useEffect(() => {
    //TODO Error handling
    //TODO Progress messages
    //TODO Check if entries are already in sync before updating
    async function importNext() {
      const [head, ...tail] = itemsToImport;
      const gameId = head["@_objectid"];
      const own = head.status["@_own"] === "1";
      const wantToPlay = head.status["@_wanttoplay"] === "1";
      const wishlist = head.status["@_wishlist"] === "1";
      const newImportSteps = await changeCollectionStatus(
        gameId,
        own,
        wantToPlay,
        wishlist
      );
      if (!!newImportSteps) {
        setImportSteps((prev) => [...prev, ...newImportSteps]);
      }
      setImportProgress((prev) => prev + 1);
      setItemsToImport(tail);
    }
    if (!!itemsToImport && itemsToImport.length > 0) {
      importNext();
    } else if (!!itemsToImport) {
      setStep("done");
    }
  }, [itemsToImport]);

  const bggAccountDone = () => {
    if (bggName !== userProfile.bggName) {
      setLoading(true);
      fetch("/api/database/activeUserProfile", {
        method: "POST",
        body: JSON.stringify({
          ...userProfile,
          bggName: bggName,
        }),
      }).then(() => {
        setStep("type");
        setLoading(false);
      });
    } else {
      setStep("type");
    }
  };

  const typeDone = async function () {
    setLoading(true);
    setStep("request");
    //TODO API sometimes answers with 429 after a few requests and the import fails
    const tryFetchCollection = () => {
      fetch(`https://api.geekdo.com/xmlapi/collection/${bggName}`, {
        // mode: "no-cors",
      })
        .then((response) => {
          if (response.status === 202) {
            setTimeout(tryFetchCollection, 2500);
          } else if (response.status === 200) {
            response
              .text()
              .then((xml) => xmlParser.parse(xml))
              .then((obj) => {
                setLoading(false);
                requestDone(obj);
              });
          } else {
            console.error("Unexpected response status from BGG API", response);
            throw new Error("Unexpected response status from BGG API");
          }
        })
        .catch((reason) => {
          console.error(
            "Fetching data from BGG API failed for unexpected reasons",
            reason
          );
          throw new Error(
            "Fetching data from BGG API failed for unexpected reasons"
          );
        });
    };
    tryFetchCollection();
  };

  const requestDone = async function (importObject: any) {
    console.log(importObject);
    setLoading(true);
    setStep("import");
    if (!!importObject) {
      const items = importObject.items.item;
      setItemsToImport(items);
      setToImport(items.length);
    }
  };

  switch (step) {
    case "username":
      //TODO Input validation
      return (
        <>
          <h2>Import from your BoardGameGeek account</h2>
          {progressBar(step)}
          <form className="container-sm row row-cols-3">
            <div className="col">
              <label>Your BoardGameGeek username</label>
              <input
                className="form-control"
                type="text"
                placeholder="BoardGameGeek username"
                value={!!bggName ? bggName : ""}
                onChange={(e) => setBggName(e.currentTarget.value)}
              />
            </div>
          </form>
          <button
            type="button"
            className="btn btn-primary"
            onClick={bggAccountDone}
            disabled={loading}
          >
            Next{" "}
            {loading ? (
              <div className="spinner-border spinner-border-sm" />
            ) : (
              <i className="bi bi-caret-right-square"></i>
            )}
          </button>
        </>
      );
    case "type":
      return (
        <>
          <h2>Import from your BoardGameGeek account</h2>
          {progressBar(step)}
          <p>Currently there is nothing to do here.</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={typeDone}
            disabled={loading}
          >
            Go on then! <i className="bi bi-caret-right-square"></i>
          </button>
        </>
      );
    case "request":
      return (
        <>
          <h2>Import from your BoardGameGeek account</h2>
          {progressBar(step)}
          <p>
            Requesting your collection. This may take a couple of seconds.
            There&apos;s nothing you can do here.
          </p>
        </>
      );
    case "import":
      return (
        <>
          <h2>Import from your BoardGameGeek account</h2>
          {progressBar(step)}
          <div
            className="progress"
            role="progressbar"
            aria-label="Number of games to import"
            aria-valuenow={importProgress}
            aria-valuemin={0}
            aria-valuemax={toImport}
          >
            <div
              className="progress-bar"
              style={{ width: `${(importProgress / toImport) * 100}%` }}
            >
              {importProgress} / {toImport}
            </div>
          </div>
          {renderImportSteps(importSteps)}
        </>
      );
    case "done":
      return (
        <>
          <h2>Import from your BoardGameGeek account</h2>
          {progressBar(step)}
          {renderImportSteps(importSteps)}
        </>
      );
    default:
      return <p>?</p>;
  }
}

function progressBar(active: Step) {
  return (
    <ul className={styles.progress}>
      <li className={active === "username" ? styles.active : ""}>
        BGG Account
      </li>
      <li className={active === "type" ? styles.active : ""}>Configuration</li>
      <li className={active === "request" ? styles.active : ""}>Request</li>
      <li className={active === "import" ? styles.active : ""}>Import</li>
      <li className={active === "done" ? styles.active : ""}>Done</li>
    </ul>
  );
}

function renderImportSteps(importSteps: ImportStep[]) {
  return (
    <ul className={styles.importSteps}>
      {importSteps.map((s, i) => (
        <li key={i} className={styles.importStep}>
          {s.operation === "added" && (
            <i
              className={`bi bi-plus-circle-fill ${styles.importStepIcon}`}
            ></i>
          )}
          {s.image && <Image src={s.image} width="50" height="50" alt={s.text} className={styles.importStepImage} /> }
          {s.text}
        </li>
      ))}
    </ul>
  );
}

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
      return
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
