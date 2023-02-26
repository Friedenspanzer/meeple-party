"use client";

import { UserContext } from "@/context/userContext";
import { CollectionStatus } from "@/pages/api/database/collection/[gameId]";
import { XMLParser } from "fast-xml-parser";
import { useContext, useEffect, useState } from "react";
import styles from "./sync.module.css";

type Step = "username" | "type" | "request" | "import" | "done";

interface ImportStep {
  text: string;
  type: "own" | "wanttoplay" | "wishlist";
  operation: "added" | "removed";
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
    const tryFetchCollection = () => {
      fetch(`https://api.geekdo.com/xmlapi/collection/${bggName}`)
        .then((response) => response.text())
        .then((xml) => xmlParser.parse(xml))
        .then((obj) => {
          console.log(obj);
          if (!obj.message && !!obj.items["@_totalitems"]) {
            console.log(obj.items["@_totalitems"]);
            setLoading(false);
            requestDone(obj);
          } else {
            setTimeout(tryFetchCollection, 2500);
          }
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
      setToImport(items.length);
      for (let item of items) {
        const gameId = item["@_objectid"];
        const own = item.status["@_own"] === "1";
        const wantToPlay = item.status["@_wanttoplay"] === "1";
        const wishlist = item.status["@_wishlist"] === "1";
        console.log(gameId, own, wantToPlay, wishlist);
        if (own || wantToPlay || wishlist) {
          await fetch(`/api/database/collection/${gameId}`, {
            method: "POST",
            body: JSON.stringify({
              own,
              wishlist,
              wantToPlay,
            } as CollectionStatus),
          });
        }
        //TODO Error handling
        //TODO Progress messages
        //TODO The progress bar does not update as state setting is not immediate
        //TODO Check if entries are already in sync before updating
        setImportProgress(importProgress + 1);
      }
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
          {(importProgress / toImport) * 100}
          <ul>
            {importSteps.map((s, i) => (
              <li key={i}>{s.text}</li>
            ))}
          </ul>
        </>
      );
    case "done":
      return <p>done</p>;
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
