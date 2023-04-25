import classNames from "classnames";
import React, { useCallback } from "react";
import { CollectionStatusFilterOption } from "../GameCollectionFilter";
import styles from "./collectionstatus.module.css";

interface CollectionStatusProps {
  filter: CollectionStatusFilterOption;
  onChange: (filter: CollectionStatusFilterOption) => void;
}

const CollectionStatus: React.FC<CollectionStatusProps> = ({
  filter,
  onChange,
}) => {
  const cycleOwn = useCallback(() => {
    if (filter.own === undefined) {
      onChange({ ...filter, own: true });
    } else if (filter.own) {
      onChange({ ...filter, own: false });
    } else {
      onChange({ ...filter, own: undefined });
    }
  }, [filter, onChange]);

  const cycleWantToPlay = useCallback(() => {
    if (filter.wantToPlay === undefined) {
      onChange({ ...filter, wantToPlay: true });
    } else if (filter.wantToPlay) {
      onChange({ ...filter, wantToPlay: false });
    } else {
      onChange({ ...filter, wantToPlay: undefined });
    }
  }, [filter, onChange]);

  const cycleWishlist = useCallback(() => {
    if (filter.wishlist === undefined) {
      onChange({ ...filter, wishlist: true });
    } else if (filter.wishlist) {
      onChange({ ...filter, wishlist: false });
    } else {
      onChange({ ...filter, wishlist: undefined });
    }
  }, [filter, onChange]);

  return (
    <>
      <div className="row text-center">
        <div
          className="col-4"
          onClick={(_) => {
            cycleOwn();
          }}
        >
          <i
            className={classNames("bi bi-box-seam-fill", styles.icon, {
              [styles.positive]: filter.own === true,
              [styles.negative]: filter.own === false,
            })}
          ></i>
        </div>
        <div
          className="col-4"
          onClick={(_) => {
            cycleWantToPlay();
          }}
        >
          <i
            className={classNames("bi bi-dice-3-fill", styles.icon, {
              [styles.positive]: filter.wantToPlay === true,
              [styles.negative]: filter.wantToPlay === false,
            })}
          ></i>
        </div>
        <div
          className="col-4"
          onClick={(_) => {
            cycleWishlist();
          }}
        >
          <i
            className={classNames("bi bi-gift-fill", styles.icon, {
              [styles.positive]: filter.wishlist === true,
              [styles.negative]: filter.wishlist === false,
            })}
          ></i>
        </div>
      </div>
      <div className={classNames("row text-center", styles.textual)}>
        <div className="col-4">{getOwnText(filter)}</div>
        <div className="col-4">{getWantToPlayText(filter)}</div>
        <div className="col-4">{getWishlistText(filter)}</div>
      </div>
    </>
  );
};

export function getCombinedText(filter: CollectionStatusFilterOption) {
  const texts: string[] = [];
  if (filter.own !== undefined) {
    texts.push(getOwnText(filter)!.toLowerCase());
  }
  if (filter.wantToPlay !== undefined) {
    texts.push(getWantToPlayText(filter)!.toLowerCase());
  }
  if (filter.wishlist !== undefined) {
    texts.push(getWishlistText(filter)!.toLowerCase());
  }
  if (texts.length === 0) {
    return undefined;
  }
  return `You ${texts.join(", ")}`;
}

function getOwnText(filter: CollectionStatusFilterOption) {
  if (filter.own === undefined) {
    return undefined;
  } else if (filter.own) {
    return "Own";
  } else {
    return "Don't own";
  }
}

function getWantToPlayText(filter: CollectionStatusFilterOption) {
  if (filter.wantToPlay === undefined) {
    return undefined;
  } else if (filter.wantToPlay) {
    return "Want to play";
  } else {
    return "Don't want to play";
  }
}

function getWishlistText(filter: CollectionStatusFilterOption) {
  if (filter.wishlist === undefined) {
    return undefined;
  } else if (filter.wishlist) {
    return "Wish";
  } else {
    return "Don't wish";
  }
}

export default CollectionStatus;
