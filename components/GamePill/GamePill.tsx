"use client";

import { Game } from "@/datatypes/game";
import useGame, { useGameQuery } from "@/hooks/api/useGame";
import classNames from "classnames";
import Image from "next/image";
import { useEffect, useState } from "react";
import CriticalError from "../CriticalError/CriticalError";
import styles from "./gamepill.module.css";

type DefaultProperties = Omit<React.HTMLAttributes<HTMLDivElement>, "onClick">;

export interface GamePillProps extends DefaultProperties {
  gameId: number;
  action?: (gameId: number) => void;
  children?: React.ReactNode;
}

const GamePill: React.FC<GamePillProps> = ({
  gameId,
  action,
  children,
  ...props
}) => {
  const { isLoading, isError, data } = useGame(gameId);

  if (isLoading) {
    return <div className={classNames(styles.pill, "shimmer")} />;
  }

  if (isError || !data) {
    return <></>;
  }

  return (
    <div
      {...props}
      className={classNames([
        props.className,
        styles.pill,
        !!action && styles.clickable,
      ])}
      onClick={(e) => {
        if (action) {
          action(data.id);
        }
      }}
    >
      {data.thumbnail && (
        <Image
          src={data.thumbnail}
          width={26}
          height={26}
          alt={data.name || ""}
          className={styles.image}
          unoptimized
        />
      )}
      {data.name}
      {children}
    </div>
  );
};

export default GamePill;
