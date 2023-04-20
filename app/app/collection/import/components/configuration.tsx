"use client";

import { useState } from "react";
import { ImportConfiguration } from "../page";

export interface ConfigurationProps {
  onDone: (configuration: ImportConfiguration) => void;
}

const Configuration: React.FC<ConfigurationProps> = ({ onDone }) => {
  const [configuration, setConfiguration] = useState<ImportConfiguration>({
    mode: "update",
    markAsOwned: { owned: true, preordered: true },
    markAsWishlisted: {
      wantToBuy: true,
      wishlist: true,
      wantInTrade: true,
      preordered: false,
    },
  });
  return (
    <div className="row align-items-center g-4">
      <div className="col-md-auto">Currently there is nothing to do here.</div>
      <div className="col">
        <button
          type="button"
          className="btn btn-primary"
          onClick={(e) => onDone(configuration)}
        >
          Go on then! <i className="bi bi-caret-right-square"></i>
        </button>
      </div>
    </div>
  );
};

export default Configuration;
