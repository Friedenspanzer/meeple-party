import useCollectionStatus from "@/feature/game-collection/hooks/useCollectionStatus";
import { useTranslation } from "@/i18n/client";
import { ActionIcon } from "@mantine/core";
import { useCallback, useMemo } from "react";
import IconCollectionOwn from "../../../../lib/icons/CollectionOwn";
import IconCollectionWantToPlay from "../../../../lib/icons/CollectionWantToPlay";
import IconCollectionWishlist from "../../../../lib/icons/CollectionWishlist";
import styles from "./statusbutton.module.css";

interface StatusButtonProps {
  gameId: number;
  status: "own" | "wanttoplay" | "wishlist";
}

export default function StatusButton({
  status,
  gameId,
}: Readonly<StatusButtonProps>) {
  const { data, isLoading, updateMutation } = useCollectionStatus(gameId);
  const { t } = useTranslation();
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
  const updateStatus = useCallback(() => {
    if (!data) {
      return;
    } else if (status === "own") {
      updateMutation.mutate({ ...data, own: !data.own });
    } else if (status === "wanttoplay") {
      updateMutation.mutate({ ...data, wantToPlay: !data.wantToPlay });
    } else if (status === "wishlist") {
      updateMutation.mutate({ ...data, wishlist: !data.wishlist });
    }
  }, [status, updateMutation, data]);

  const translationBaseKey = useMemo(() => {
    if (status === "own") {
      return "Own";
    } else if (status === "wanttoplay") {
      return "WantToPlay";
    } else if (status === "wishlist") {
      return "Wishlist";
    }
  }, [status]);

  const label = `States.${active ? "Not" : ""}${translationBaseKey}`;

  return (
    <ActionIcon
      onClick={updateStatus}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          updateStatus();
        }
      }}
      className={styles.button}
      tabIndex={0}
      variant="subtle"
      color={active ? activeColor : "gray"}
      size="xl"
      disabled={isLoading}
      aria-label={t(label)}
    >
      {icon}
    </ActionIcon>
  );
}
