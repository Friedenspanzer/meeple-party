import { Game } from "@/datatypes/game";
import { fetchGames } from "@/utility/games";
import classNames from "classnames";
import Image from "next/image";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (typeof game == "number") {
      //TODO Error handling
      fetch(`/api/games/${game}`)
        .then((response) => response.json())
        .then(setGameData);
    } else {
      setGameData(game);
    }
  }, [game]);

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
            if (!!action) {
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
            />
          )}
          {gameData?.name}
          {children}
        </div>
      ) : (
        <div className={classNames(styles.pill, styles.dummy)} />
      )}
    </>
  );
};

export default GamePill;
