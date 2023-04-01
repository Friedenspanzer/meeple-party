import GameCollection from "@/components/GameCollection/GameCollection";
import { CollectionStatus } from "@/pages/api/collection/[gameId]";
import {
  GameCollection as GameCollectionType,
  UserGameCollection,
} from "@/datatypes/collection";
import { Game } from "@/datatypes/game";
import { getAllGamesOfFriends, getCollection } from "@/selectors/collections";
import { getServerUser } from "@/utility/serverSession";
import styles from "./dashboard.module.css";

export default async function App() {
  const user = await getServerUser();
  const myGameCollection = await getCollection(user.id);
  const friendCollections = await getAllGamesOfFriends(user.id);
  const collectedGames = myGameCollection.map((g) =>
    collectGames(g, friendCollections)
  );
  const gamesThatEnoughPeopleWantToPlay = collectedGames.filter(
    enoughPeopleWantToPlay
  );
  return (
    <>
      <GameCollection
        games={gamesThatEnoughPeopleWantToPlay
          .filter(atLeastOnePersonOwns)
          .map(uncollectGames)}
        showFriendCollection
        className={styles.collection}
      >
        <h2>Games you could play right now</h2>
      </GameCollection>
      <GameCollection
        games={gamesThatEnoughPeopleWantToPlay
          .filter(somebodyWantsToBuy)
          .filter(nobodyOwns)
          .map(uncollectGames)}
        showFriendCollection
        className={styles.collection}
      >
        <h2>Games somebody should probably buy already</h2>
      </GameCollection>
    </>
  );
}

type CollectedGame = {
  friendCollections: UserGameCollection[] | undefined;
  game: Game;
  status: {
    own: boolean;
    wantToPlay: boolean;
    wishlist: boolean;
  };
};

function collectGames(
  myGame: GameCollectionType,
  friendCollections: UserGameCollection[]
) {
  return {
    ...myGame,
    friendCollections: friendCollections.filter(
      (g) => g.game.id === myGame.game.id
    ),
  };
}

function uncollectGames(collectedGame: CollectedGame): {
  game: number | Game;
  status?: CollectionStatus | undefined;
} {
  return {
    game: collectedGame.game,
    status: collectedGame.status,
  };
}

function atLeastOnePersonOwns({
  game,
  status,
  friendCollections,
}: CollectedGame) {
  return (
    status.own ||
    (friendCollections &&
      friendCollections.find((f) => f.game.id === game.id && f.status.own))
  );
}

function nobodyOwns({ game, status, friendCollections }: CollectedGame) {
  return (
    !status.own &&
    friendCollections &&
    !friendCollections.find((f) => f.game.id === game.id && f.status.own)
  );
}

function enoughPeopleWantToPlay({
  game,
  status,
  friendCollections,
}: CollectedGame) {
  let count = 0;
  if (status.wantToPlay) {
    count++;
  }
  friendCollections?.forEach((c) => {
    if (c.status.wantToPlay) {
      count++;
    }
  });
  return count >= game.minPlayers;
}

function somebodyWantsToBuy({
  game,
  status,
  friendCollections,
}: CollectedGame) {
  return (
    status.wishlist ||
    (friendCollections &&
      friendCollections.find((f) => f.game.id === game.id && f.status.wishlist))
  );
}
