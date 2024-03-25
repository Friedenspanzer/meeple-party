import Spinner from "@/components/Spinner/Spinner";
import IconCollectionOwn from "@/components/icons/CollectionOwn";
import IconCollectionWantToPlay from "@/components/icons/CollectionWantToPlay";
import IconCollectionWishlist from "@/components/icons/CollectionWishlist";
import classNames from "classnames";
import { useMemo } from "react";
import styles from "./statusbutton.module.css";

interface StatusButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  status: "own" | "wanttoplay" | "wishlist";
  loading?: boolean;
  active: boolean;
  toggle?: () => void;
}

export default function StatusButton({
  status,
  loading = false,
  active,
  toggle = () => {},
  ...props
}: Readonly<StatusButtonProps>) {
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

  if (loading) {
    return (
      <Spinner
        {...props}
        size="small"
        className={classNames(styles.spinner, props.className)}
      />
    );
  } else {
    return (
      <div
        {...props}
        onClick={(e) => {
          if (props.onClick) {
            props.onClick(e); //TODO Test this logic
          }
          toggle();
        }}
        onKeyDown={(e) => {
          if (props.onKeyDown) {
            props.onKeyDown(e); //TODO Test this logic
          }
          if (e.key === "Enter") {
            toggle();
          }
        }}
        tabIndex={0}
        className={classNames(styles.button, props.className)}
        style={{
          ...props.style,
          color: active ? activeColor : "unset",
        }}
        role="button"
      >
        {icon}
      </div>
    );
  }
}
