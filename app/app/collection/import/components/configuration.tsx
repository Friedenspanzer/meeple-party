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
          <div className="col-10">
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
          <div className="col-10">
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
          <div className="col-10">
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
