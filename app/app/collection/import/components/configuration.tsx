"use client";

import classNames from "classnames";
import { useState } from "react";
import { ImportConfiguration } from "../page";

export interface ConfigurationProps {
  onDone: (configuration: ImportConfiguration) => void;
}

const Configuration: React.FC<ConfigurationProps> = ({ onDone }) => {
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
  return (
    <>
      <div className="row mb-2">
        <div className="col">
          <h3>Import mode</h3>
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
              <i className="bi bi-patch-plus"></i> Update
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
              <i className="bi bi-box-arrow-in-left"></i> Merge
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
              <i className="bi bi-eraser-fill"></i> Overwrite
            </button>
          </div>
        </div>
        {configuration.mode === "update" && (
          <div className="col-md-10">
            <h4>
              <i className="bi bi-patch-plus"></i> Update
            </h4>
            <p>
              Adds everything from your BoardGameGeek collection to Meeple
              Party. Does not delete anything. Does not remove collection states
              from Meeple Party.
            </p>
            <p>
              A game that is flagged as Own and Want To Play in Meeple Party and
              Want To Play and Wishlist on BoardGameGeek will be flagged as Own,
              Want To Play and Wishlist afterwards.
            </p>
          </div>
        )}
        {configuration.mode === "merge" && (
          <div className="col-md-10">
            <h4>
              <i className="bi bi-box-arrow-in-left"></i> Merge
            </h4>
            <p>
              Games in your BoardGameGeek collection but not your Meeple Party
              collection will be imported. Games in your Meeple Party collection
              but not in your BoardGameGeek collection will remain unchanged.
            </p>
            <p>
              For all games in both collections the collection state from
              BoardGameGeek will overwrite the collection state in Meeple Party.
            </p>
            <p>
              A game that is flagged as Own and Want To Play in Meeple Party and
              Want To Play and Wishlist on BoardGameGeek will be flagged as Want
              To Play and Wishlist afterwards.
            </p>
          </div>
        )}
        {configuration.mode === "overwrite" && (
          <div className="col-md-10">
            <h4>
              <i className="bi bi-eraser-fill"></i> Overwrite
            </h4>
            <p>
              Overwrites your Meeple Party collection with your BoardGameGeek
              collection.
            </p>
            <p>
              Everything that is in your Meeple Party collection but not in your
              BoardGameGeek collection will be lost. Every state you set in
              Meeple Party but not on BoardGameGeek will be lost.
            </p>
          </div>
        )}
      </div>
      <div className="row mb-2">
        <div className="col">
          <h3>What BGG status to import</h3>
        </div>
      </div>
      <div className="row mb-2">
        <div className="col-md-4">
          <h4>Own</h4>
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
              Owned
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
              Preordered
            </label>
          </div>
        </div>
        <div className="col-md-4">
          <h4>Want To Play</h4>
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
              Want to Play
            </label>
          </div>
        </div>
        <div className="col-md-4">
          <h4>Wishlist</h4>
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
              Want to Buy
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
              Wishlist
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
              Want in Trade
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
              Preorder
            </label>
          </div>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col">
          <button
            type="button"
            className="btn btn-primary"
            onClick={(e) => onDone(configuration)}
          >
            Save and continue <i className="bi bi-caret-right-square"></i>
          </button>
        </div>
      </div>
    </>
  );
};

export default Configuration;
