"use client";

import GameCollection from "@/components/GameCollection/GameCollection";
import GameSearch, {
  GameSearchChildren,
} from "@/components/GameSearch/GameSearch";

const resultView: React.FC<GameSearchChildren> = ({ searchResult }) => {
  return <GameCollection games={searchResult} showFilter={false} />;
};

export default function Search() {
  return <GameSearch resultView={resultView}></GameSearch>;
}
