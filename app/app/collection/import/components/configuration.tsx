"use client";

import { useTranslation } from "@/i18n/client";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { Trans } from "react-i18next";
import { ImportConfiguration } from "../page";

const LOCAL_STORAGE_KEY = "importConfiguration";

export interface ConfigurationProps {
  onDone: (configuration: ImportConfiguration) => void;
}

const Configuration: React.FC<ConfigurationProps> = ({ onDone }) => {
  const { t } = useTranslation("import");
  const { t: dt } = useTranslation();

  const [configuration, setConfiguration] = useState<ImportConfiguration>({
    mode: "update",
    markAsOwned: { owned: true, preordered: true },
    markAsWantToPlay: { wantToPlay: true },
    markAsWishlisted: {
      wantToBuy: true,
      wishlist: true,
      wantInTrade: true,
      preordered: false,
    },
  });

  useEffect(() => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      setConfiguration(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(configuration));
  }, [configuration]);

  return (
    <>
      <div className="row mb-2">
        <div className="col">
          <h3>{t("Configuration.Mode")}</h3>
        </div>
      </div>
      <div className="row g-2">
        <div className="col-md-2">
          <div className="btn-group-vertical" role="group">
            <button
              type="button"
              className={classNames("btn", {
                "btn-primary": configuration.mode === "update",
                "btn-outline-secondary": configuration.mode !== "update",
              })}
              onClick={(e) =>
                setConfiguration({ ...configuration, mode: "update" })
              }
            >
              <i className="bi bi-patch-plus"></i> {t("Configuration.Update")}
            </button>
            <button
              type="button"
              className={classNames("btn", {
                "btn-primary": configuration.mode === "merge",
                "btn-outline-secondary": configuration.mode !== "merge",
              })}
              onClick={(e) =>
                setConfiguration({ ...configuration, mode: "merge" })
              }
            >
              <i className="bi bi-box-arrow-in-left"></i>{" "}
              {t("Configuration.Merge")}
            </button>
            <button
              type="button"
              className={classNames("btn", {
                "btn-primary": configuration.mode === "overwrite",
                "btn-outline-secondary": configuration.mode !== "overwrite",
              })}
              onClick={(e) =>
                setConfiguration({ ...configuration, mode: "overwrite" })
              }
            >
              <i className="bi bi-eraser-fill"></i>{" "}
              {t("Configuration.Overwrite")}
            </button>
          </div>
        </div>
        {configuration.mode === "update" && (
          <div className="col-md-10">
            <h4>
              <i className="bi bi-patch-plus"></i> {t("Configuration.Update")}
            </h4>
            <Trans i18nKey="Configuration.Explanations.Update" ns="import" />
          </div>
        )}
        {configuration.mode === "merge" && (
          <div className="col-md-10">
            <h4>
              <i className="bi bi-box-arrow-in-left"></i>{" "}
              {t("Configuration.Merge")}
            </h4>
            <Trans i18nKey="Configuration.Explanations.Merge" ns="import" />
          </div>
        )}
        {configuration.mode === "overwrite" && (
          <div className="col-md-10">
            <h4>
              <i className="bi bi-eraser-fill"></i>{" "}
              {t("Configuration.Overwrite")}
            </h4>
            <Trans i18nKey="Configuration.Explanations.Overwrite" ns="import" />
          </div>
        )}
      </div>
      <div className="row mb-2">
        <div className="col">
          <h3>{t("Configuration.BggToMeepleParty")}</h3>
        </div>
      </div>
      <div className="row mb-2 g-2">
        <div className="col-md-4">
          <h4>
            <i className="bi bi-box-seam-fill"></i> {dt("States.Own")}
          </h4>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckOwnOwn"
              checked={configuration.markAsOwned.owned}
              onChange={(e) =>
                setConfiguration({
                  ...configuration,
                  markAsOwned: {
                    ...configuration.markAsOwned,
                    owned: e.currentTarget.checked,
                  },
                })
              }
            />
            <label className="form-check-label" htmlFor="flexSwitchCheckOwnOwn">
              {t("Configuration.BggStatus.Owned")}
            </label>
          </div>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckOwnPreordered"
              checked={configuration.markAsOwned.preordered}
              onChange={(e) =>
                setConfiguration({
                  ...configuration,
                  markAsOwned: {
                    ...configuration.markAsOwned,
                    preordered: e.currentTarget.checked,
                  },
                })
              }
            />
            <label
              className="form-check-label"
              htmlFor="flexSwitchCheckOwnPreordered"
            >
              {t("Configuration.BggStatus.Preordered")}
            </label>
          </div>
        </div>
        <div className="col-md-4">
          <h4>
            <i className="bi bi-dice-3-fill"></i> {dt("States.WantToPlay")}
          </h4>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckWantToPlay"
              checked={configuration.markAsWantToPlay.wantToPlay}
              onChange={(e) =>
                setConfiguration({
                  ...configuration,
                  markAsWantToPlay: {
                    ...configuration.markAsWantToPlay,
                    wantToPlay: e.currentTarget.checked,
                  },
                })
              }
            />
            <label
              className="form-check-label"
              htmlFor="flexSwitchCheckWantToPlay"
            >
              {t("Configuration.BggStatus.WantToPlay")}
            </label>
          </div>
        </div>
        <div className="col-md-4">
          <h4>
            <i className="bi bi-gift-fill"></i> {dt("States.Wishlist")}
          </h4>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckWishlistWantToBuy"
              checked={configuration.markAsWishlisted.wantToBuy}
              onChange={(e) =>
                setConfiguration({
                  ...configuration,
                  markAsWishlisted: {
                    ...configuration.markAsWishlisted,
                    wantToBuy: e.currentTarget.checked,
                  },
                })
              }
            />
            <label
              className="form-check-label"
              htmlFor="flexSwitchCheckWishlistWantToBuy"
            >
              {t("Configuration.BggStatus.WantToBuy")}
            </label>
          </div>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckWishlistWishlist"
              checked={configuration.markAsWishlisted.wishlist}
              onChange={(e) =>
                setConfiguration({
                  ...configuration,
                  markAsWishlisted: {
                    ...configuration.markAsWishlisted,
                    wishlist: e.currentTarget.checked,
                  },
                })
              }
            />
            <label
              className="form-check-label"
              htmlFor="flexSwitchCheckWishlistWishlist"
            >
              {t("Configuration.BggStatus.Wishlist")}
            </label>
          </div>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckWishlistWantInTrade"
              checked={configuration.markAsWishlisted.wantInTrade}
              onChange={(e) =>
                setConfiguration({
                  ...configuration,
                  markAsWishlisted: {
                    ...configuration.markAsWishlisted,
                    wantInTrade: e.currentTarget.checked,
                  },
                })
              }
            />
            <label
              className="form-check-label"
              htmlFor="flexSwitchCheckWishlistWantInTrade"
            >
              {t("Configuration.BggStatus.WantInTrade")}
            </label>
          </div>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckWishlistPreorder"
              checked={configuration.markAsWishlisted.preordered}
              onChange={(e) =>
                setConfiguration({
                  ...configuration,
                  markAsWishlisted: {
                    ...configuration.markAsWishlisted,
                    preordered: e.currentTarget.checked,
                  },
                })
              }
            />
            <label
              className="form-check-label"
              htmlFor="flexSwitchCheckWishlistPreorder"
            >
              {t("Configuration.BggStatus.Preordered")}
            </label>
          </div>
        </div>
      </div>
      {configuration.markAsOwned.preordered &&
        configuration.markAsWishlisted.preordered && (
          <div className="row mb-2">
            <div className="col alert alert-warning">
              <i className="bi bi-exclamation-octagon-fill"></i>{" "}
              <strong>
                {t("Configuration.Warnings.PreorderedTwice.Heading")}
              </strong>{" "}
              <Trans
                i18nKey="Configuration.Warnings.PreorderedTwice.Text"
                ns="import"
              />
            </div>
          </div>
        )}
      {configuration.mode === "merge" &&
        ((!configuration.markAsOwned.owned &&
          !configuration.markAsOwned.preordered) ||
          !configuration.markAsWantToPlay.wantToPlay ||
          (!configuration.markAsWishlisted.preordered &&
            !configuration.markAsWishlisted.wantInTrade &&
            !configuration.markAsWishlisted.wantToBuy &&
            !configuration.markAsWishlisted.wishlist)) && (
          <div className="row mb-2">
            <div className="col alert alert-warning">
              <i className="bi bi-exclamation-octagon-fill"></i>{" "}
              <strong>
                {t("Configuration.Warnings.NoStatusInMerge.Heading")}
              </strong>{" "}
              <Trans
                i18nKey="Configuration.Warnings.NoStatusInMerge.Text"
                ns="import"
              />
            </div>
          </div>
        )}
      {configuration.mode === "overwrite" && (
        <div className="row mb-2">
          <div className="col alert alert-warning">
            <i className="bi bi-exclamation-octagon-fill"></i>{" "}
            <strong>{t("Configuration.Warnings.Overwrite.Heading")}</strong>{" "}
            <Trans
              i18nKey="Configuration.Warnings.Overwrite.Text"
              ns="import"
            />
          </div>
        </div>
      )}
      {configuration.mode === "overwrite" &&
        !configuration.markAsOwned.owned &&
        !configuration.markAsOwned.preordered &&
        !configuration.markAsWantToPlay.wantToPlay &&
        !configuration.markAsWishlisted.preordered &&
        !configuration.markAsWishlisted.wantInTrade &&
        !configuration.markAsWishlisted.wantToBuy &&
        !configuration.markAsWishlisted.wishlist && (
          <div className="row mb-2">
            <div className="col alert alert-danger">
              <i className="bi bi-exclamation-octagon-fill"></i>{" "}
              <strong>
                {t("Configuration.Warnings.OverwriteAll.Heading")}
              </strong>{" "}
              <Trans
                i18nKey="Configuration.Warnings.OverwriteAll.Text"
                ns="import"
              />
            </div>
          </div>
        )}
      <div className="row">
        <div className="col">
          <button
            type="button"
            className="btn btn-primary"
            onClick={(e) => onDone(configuration)}
          >
            {dt("Actions.SaveAndContinue")}{" "}
            <i className="bi bi-caret-right-square"></i>
          </button>
        </div>
      </div>
    </>
  );
};

export default Configuration;
