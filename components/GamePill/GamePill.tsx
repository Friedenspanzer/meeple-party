import { Game } from "@/datatypes/game";
import { fetchGames } from "@/utility/games";
import classNames from "classnames";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./gamepill.module.css";

export interface GamePillProps extends React.HTMLAttributes<HTMLDivElement> {
  game: number | Game;
  action?: (gameId: number) => void;
}

const GamePill: React.FC<GamePillProps> = ({ game, action, ...props }) => {
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
          className={classNames([props.className, styles.pill])}
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
        </div>
      ) : (
        <div className={classNames(styles.pill, styles.dummy)} />
      )}
    </>
  );
};

export default GamePill;
