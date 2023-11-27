import useCollectionStatus from "@/hooks/api/useCollectionStatus";
import classNames from "classnames";
import { useCallback, useMemo } from "react";
import Spinner from "../Spinner/Spinner";
import IconCollectionOwn from "../icons/CollectionOwn";
import IconCollectionWantToPlay from "../icons/CollectionWantToPlay";
import IconCollectionWishlist from "../icons/CollectionWishlist";
import styles from "./statusbutton.module.css";

interface StatusButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  gameId: number;
  status: "own" | "wanttoplay" | "wishlist";
}

export default function StatusButton({
  status,
  gameId,
  ...props
}: Readonly<StatusButtonProps>) {
  const { data, isLoading, mutate } = useCollectionStatus(gameId);
  const icon = useMemo(() => {
    if (status === "own") {
      return <IconCollectionOwn />;
    } else if (status === "wanttoplay") {
      return <IconCollectionWantToPlay />;
    } else if (status === "wishlist") {
      return <IconCollectionWishlist />;
    }
  }, [status]);
  const activeColor = useMemo(() => {
    if (status === "own") {
      return "var(--color-collection-own)";
    } else if (status === "wanttoplay") {
      return "var(--color-collection-want-to-play)";
    } else if (status === "wishlist") {
      return "var(--color-collection-wishlist)";
    }
  }, [status]);
  const active = useMemo(() => {
    if (!data) {
      return false;
    } else if (status === "own") {
      return data.own;
    } else if (status === "wishlist") {
      return data.wishlist;
    } else if (status === "wanttoplay") {
      return data.wantToPlay;
    }
  }, [data, status]);
  const onClick = useCallback(() => {
    if (!data) {
      return;
    } else if (status === "own") {
      mutate({ ...data, own: !data.own });
    } else if (status === "wanttoplay") {
      mutate({ ...data, wantToPlay: !data.wantToPlay });
    } else if (status === "wishlist") {
      mutate({ ...data, wishlist: !data.wishlist });
    }
  }, [status, mutate, data]);

  if (isLoading) {
    return (
      <Spinner
        {...props}
        className={classNames(styles.spinner, props.className)}
      />
    );
  } else {
    return (
      <div
        {...props}
        onClick={onClick}
        className={classNames(styles.button, props.className)}
        style={{
          ...props.style,
          color: active ? activeColor : "unset",
        }}
      >
        {icon}
      </div>
    );
  }
}
