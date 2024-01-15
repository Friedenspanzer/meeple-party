"use client";

import { useTranslation } from "@/i18n/client";
import useMyUserProfile from "@/lib/hooks/data/useMyUserProfile";
import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "../Spinner/Spinner";

export default function CompleteUserProfile() {
  const { isLoading, userProfile, invalidate } = useMyUserProfile();

  const [username, setUserName] = useState("");
  const [realName, setRealName] = useState("");

  const [updating, setUpdating] = useState(false);

  const { t } = useTranslation("profile");
  const { t: td } = useTranslation();

  useEffect(() => {
    if (userProfile) {
      setUserName(userProfile.name || "");
      setRealName(userProfile.realName || "");
    }
  }, [userProfile]);

  const sendCurrentData = () => {
    setUpdating(true);
    axios
      .patch("/api/user", {
        name: username,
        realName: realName,
      })
      .then(() => setUpdating(false))
      .then(() => invalidate());
  };

  if (isLoading) {
    return <Spinner />;
  }

  //TODO Input sanitation and validation

  return (
    <>
      <h2>{t("Complete.Header")}</h2>
      <p>{t("Complete.Explanation")}</p>
      <form className="container-sm row row-cols-3">
        <div className="col">
          <label>{t("Complete.DisplayName")}</label>
          <input
            className="form-control"
            type="text"
            placeholder={t("Complete.DisplayName")}
            value={username ?? ""}
            onChange={(e) => {
              setUserName(e.currentTarget.value);
            }}
            disabled={updating}
          />
          <p className="text-muted">{t("Complete.DisplayNameExplanation")}</p>
        </div>
        <div className="col">
          <label>{t("Complete.RealName")}</label>
          <input
            className="form-control"
            type="text"
            placeholder={t("Complete.RealName")}
            value={!!realName ? realName : ""}
            onChange={(e) => {
              setRealName(e.currentTarget.value);
            }}
            disabled={updating}
          />
          <p className="text-muted">{t("Complete.RealNameExplanation")}</p>
        </div>
        <div className="col">
          <label>{t("Complete.EmailAddress")}</label>
          <input
            className="form-control"
            type="email"
            placeholder={t("Complete.EmailAddress")}
            disabled
            value={userProfile?.email ?? ""}
          />
        </div>
      </form>
      <button
        type="button"
        className="btn btn-primary"
        onClick={sendCurrentData}
        disabled={updating}
      >
        {updating ? (
          <>
            <Spinner style={{ marginRight: "0.5rem" }} />
            {td("LoadingIndicators.Sending")}
          </>
        ) : (
          td("Actions.Submit")
        )}
      </button>
    </>
  );
}
