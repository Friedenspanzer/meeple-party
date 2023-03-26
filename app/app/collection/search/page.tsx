"use client";

import GameBox from "@/components/GameBox/GameBox";
import GameSearch, {
  GameSearchChildren,
} from "@/components/GameSearch/GameSearch";

const resultView: React.FC<GameSearchChildren> = ({ searchResult }) => {
  return (
    <>
      {searchResult.map((r) => (
        <GameBox game={r.id} key={r.id} />
      ))}
    </>
  );
};

export default function Search() {
  return <GameSearch resultView={resultView}></GameSearch>;
}
