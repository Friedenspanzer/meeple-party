"use client";

import { useState } from "react";
import styles from "./sync.module.css";
import Username from "./components/username";
import Configuration from "./components/configuration";
import Request from "./components/request";
import Import from "./components/import";
import { getTranslation } from "@/i18n";
import { useTranslation } from "@/i18n/client";
import { TFunction } from "i18next";

type Step = "username" | "type" | "request" | "import" | "done";

export type ImportMode = "update" | "merge" | "overwrite";

export interface ImportConfiguration {
  mode: ImportMode;
  markAsOwned: {
    owned: boolean;
    preordered: boolean;
  };
  markAsWantToPlay: {
    wantToPlay: boolean;
  };
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
      <ProgressBar active={step} />
      {stepComponent}
    </>
  );
}

const ProgressBar: React.FC<{ active: Step }> = ({
  active,
}: {
  active: Step;
}) => {
  const { t } = useTranslation("import");
  return (
    <ul className={styles.progress}>
      <li className={active === "username" ? styles.active : ""}>
        {t("Steps.Account")}
      </li>
      <li className={active === "type" ? styles.active : ""}>
        {t("Steps.Configuration")}
      </li>
      <li className={active === "request" ? styles.active : ""}>
        {t("Steps.Request")}
      </li>
      <li className={active === "import" ? styles.active : ""}>
        {t("Steps.Import")}
      </li>
    </ul>
  );
};
