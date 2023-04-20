"use client";

import { useState } from "react";
import styles from "./sync.module.css";
import Username from "./components/username";
import Configuration from "./components/configuration";
import Request from "./components/request";
import Import from "./components/import";

type Step = "username" | "type" | "request" | "import" | "done";

export interface ImportConfiguration {
  mode: "update" | "merge" | "overwrite";
  markAsOwned: {
    owned: boolean;
    preordered: boolean;
  };
  markAsWantToPlay: {
    wantToPlay: boolean;
  },
  markAsWishlisted: {
    wantToBuy: boolean;
    wishlist: boolean;
    wantInTrade: boolean;
    preordered: boolean;
  };
}

export default function CollectionSyncPage() {
  const [step, setStep] = useState<Step>("username");
  const [importConfiguration, setImportConfiguration] =
    useState<ImportConfiguration>();
  const [bggObject, setBggObject] = useState<any>(undefined);

  const stepComponent = (
    <>
      {step === "username" && <Username onDone={() => setStep("type")} />}
      {step === "type" && (
        <Configuration
          onDone={(configuration) => {
            setImportConfiguration(configuration);
            setStep("request");
          }}
        />
      )}
      {step === "request" && (
        <Request
          onDone={(bggObject) => {
            setBggObject(bggObject);
            setStep("import");
          }}
        />
      )}
      {step === "import" && (
        <Import configuration={importConfiguration!} bggObject={bggObject} />
      )}
    </>
  );
  return (
    <>
      {progressBar(step)}
      {stepComponent}
    </>
  );
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
    </ul>
  );
}
