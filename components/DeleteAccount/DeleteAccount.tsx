"use client";

import useUserProfile from "@/hooks/useUserProfile";
import { useTranslation } from "@/i18n/client";
import axios from "axios";
import { useState } from "react";
import { Trans } from "react-i18next";
import Spinner from "../Spinner/Spinner";

type Step = "Button" | "Confirmation" | "Input" | "Deleting";

const DeleteAccount: React.FC = () => {
  const [step, setStep] = useState<Step>("Button");
  const [confirmation, setConfirmation] = useState("");
  const { userProfile } = useUserProfile();
  const { t } = useTranslation("settings");

  const deleteAccount = () => {
    setStep("Deleting");
    axios
      .delete("/api/user")
      .then(() => {
        window.location.assign("/");
      })
      .catch((error) => {
        console.error("Error deleting account", error);
      });
  };

  switch (step) {
    case "Button":
      return (
        <button
          onClick={() => setStep("Confirmation")}
          className="btn btn-warning"
        >
          <i className="bi bi-trash3-fill"></i> {t("Delete.DeleteMyAccount")}
        </button>
      );
    case "Confirmation":
      return (
        <>
          <p className="alert alert-danger" role="alert">
            <Trans i18nKey="Delete.Explanation" ns="settings" />
          </p>
          <button onClick={() => setStep("Input")} className="btn btn-danger">
            <i className="bi bi-hand-thumbs-up-fill"></i>{" "}
            {t("Delete.Confirmation_1")}
          </button>
        </>
      );
    case "Input":
      return (
        <>
          <p className="alert alert-danger" role="alert">
            <Trans
              i18nKey="Delete.TypeAccountName"
              ns="settings"
              values={{ name: userProfile?.name }}
            />
          </p>
          <input
            type="text"
            className="form-control"
            value={confirmation}
            onChange={(e) => setConfirmation(e.currentTarget.value)}
          />
          <button
            onClick={deleteAccount}
            className="btn btn-danger mt-3"
            disabled={confirmation !== userProfile?.name}
          >
            <i className="bi bi-trash3-fill"></i> {t("Delete.Confirmation_2")}
          </button>
        </>
      );
    case "Deleting":
      return (
        <>
          <Spinner />
          <p>{t("Delete.Progress")}</p>
        </>
      );
  }
};

export default DeleteAccount;
