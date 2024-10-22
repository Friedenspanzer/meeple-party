import GameCollection from "@/feature/game-collection/components/GameCollection/GameCollection";
import GameSearch, {
  GameSearchChildren,
} from "@/feature/game-database/components/GameSearch/GameSearch";

const resultView: React.FC<GameSearchChildren> = ({ searchResult }) => {
  return <GameCollection games={searchResult} showFilter={false} />;
};

export default function Search() {
  return <GameSearch resultView={resultView}></GameSearch>;
}
