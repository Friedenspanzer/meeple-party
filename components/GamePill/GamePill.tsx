"use client";

import { Game } from "@/datatypes/game";
import classNames from "classnames";
import Image from "next/image";
import { useEffect, useState } from "react";
import CriticalError from "../CriticalError/CriticalError";
import styles from "./gamepill.module.css";

type DefaultProperties = Omit<React.HTMLAttributes<HTMLDivElement>, "onClick">;

export interface GamePillProps extends DefaultProperties {
  game: number | Game;
  action?: (gameId: number) => void;
  children?: React.ReactNode;
}

const GamePill: React.FC<GamePillProps> = ({
  game,
  action,
  children,
  ...props
}) => {
  const [gameData, setGameData] = useState<Game>();
  const [error, setError] = useState<string | false>(false);
  const [errorDetail, setErrorDetail] = useState<string>();

  useEffect(() => {
    if (typeof game == "number") {
      fetch(`/api/games/${game}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            setError(`Error loading game data for game ${game}.`);
            setErrorDetail(`${response.status} ${response.statusText}`);
          }
        })
        .then(setGameData);
    } else {
      setGameData(game);
    }
  }, [game]);

  if (error) {
    return <CriticalError message={error} details={errorDetail} />;
  }

  return (
    <>
      {!!gameData ? (
        <div
          {...props}
          className={classNames([
            props.className,
            styles.pill,
            !!action && styles.clickable,
          ])}
          onClick={(e) => {
            if (action) {
              action(gameData.id);
            }
          }}
        >
          {gameData?.thumbnail && (
            <Image
              src={gameData?.thumbnail}
              width={26}
              height={26}
              alt={gameData?.name || ""}
              className={styles.image}
              unoptimized
            />
          )}
          {gameData?.name}
          {children}
        </div>
      ) : (
        <div className={classNames(styles.pill, "shimmer")} />
      )}
    </>
  );
};

export default GamePill;
