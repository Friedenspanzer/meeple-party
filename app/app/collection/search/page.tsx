"use client";

import GameBox from "@/components/GameBox/GameBox";
import GameSearch, {
  GameSearchChildren,
} from "@/components/GameSearch/GameSearch";

const resultView: React.FC<GameSearchChildren> = ({ searchResult }) => {
  return (
    <>
      {searchResult.map(({ game, status, friendCollections }) => (
        <GameBox game={game} status={status} key={game.id} />
      ))}
    </>
  );
};

export default function Search() {
  return <GameSearch resultView={resultView}></GameSearch>;
}
