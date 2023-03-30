import { Game } from "@/datatypes/game";
import { CollectionStatus } from "@/pages/api/collection/[gameId]";
import GameBox from "../GameBox/GameBox";

export interface GameCollectionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  games: {
    game: Game | number;
    status?: CollectionStatus;
  }[];
  showFriendCollection?: boolean;
  children?: React.ReactNode;
}

const GameCollection: React.FC<GameCollectionProps> = ({
  games,
  showFriendCollection = false, //TODO beachten
  children,
  ...props
}) => {
  return (
    <div {...props}>
      {children}
      <div>
        {games.map(({ game, status }) => (
          <GameBox game={game} status={status} key={getGameId(game)} />
        ))}
      </div>
    </div>
  );
};

function getGameId(game: number | Game): number {
  if (typeof game === "number") {
    return game;
  }
  return game.id;
}

export default GameCollection;
