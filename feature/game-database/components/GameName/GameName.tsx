"use client";

import { ExpandedGame } from "@/datatypes/game";
import usePreferredGameLanguage from "@/lib/hooks/usePreferredGameLanguage";

interface GameNameProps {
  game: ExpandedGame;
}

/**
 * Shows a games name in the language the user selected in their preferences. Will render only the game name as a string without any tags surrounding it.
 *
 * @example
 * return <GameName game={game} />
 */
export default function GameName({ game }: Readonly<GameNameProps>) {
  const { loading, preferredGameLanguage } = usePreferredGameLanguage();

  const translatedName = game.names.find(
    (n) => n.language === preferredGameLanguage
  );

  if (loading || !translatedName) {
    return <>{game.name}</>;
  } else {
    return <>{translatedName.name}</>;
  }
}
