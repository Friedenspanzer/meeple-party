import GameCollection from "@/components/GameCollection/GameCollection";
import {
  GameCollection as GameCollectionType,
  GameCollectionStatus,
  StatusByUser,
  UserGameCollection,
} from "@/datatypes/collection";
import { Game } from "@/datatypes/game";
import { getAllGamesOfFriends, getCollection } from "@/selectors/collections";
import { getServerUser } from "@/utility/serverSession";
import styles from "./dashboard.module.css";
import { PrivateUser } from "@/datatypes/userProfile";
import { emptyFilter } from "@/utility/filter";

export const metadata = {
  title: 'Dashboard',
}

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
        filterPresets={[
          {
            name: "Games you own",
            filter: { ...emptyFilter, collectionStatus: { own: true } },
          },
          {
            name: "Games you don't own",
            filter: { ...emptyFilter, collectionStatus: { own: false } },
          },
          {
            name: "No solo play",
            filter: {
              ...emptyFilter,
              friends: { ...emptyFilter.friends, wantToPlay: { min: 1 } },
            },
          },
          {
            name: "Games you own, no solo play",
            filter: {
              ...emptyFilter,
              collectionStatus: { own: true },
              friends: { ...emptyFilter.friends, wantToPlay: { min: 1 } },
            },
          },
          {
            name: "Games you don't own, no solo play",
            filter: {
              ...emptyFilter,
              collectionStatus: { own: false },
              friends: { ...emptyFilter.friends, wantToPlay: { min: 1 } },
            },
          },
        ]}
        defaultFilter={{
          ...emptyFilter,
          friends: { ...emptyFilter.friends, wantToPlay: { min: 1 } },
        }}
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
        filterPresets={[
          {
            name: "Your wishlist",
            filter: { ...emptyFilter, collectionStatus: { wishlist: true } },
          },
          {
            name: "No solo play",
            filter: {
              ...emptyFilter,
              friends: { ...emptyFilter.friends, wantToPlay: { min: 1 } },
            },
          },
          {
            name: "Your wishlist, no solo play",
            filter: {
              ...emptyFilter,
              collectionStatus: { wishlist: true },
              friends: { ...emptyFilter.friends, wantToPlay: { min: 1 } },
            },
          },
        ]}
        className={styles.collection}
        defaultFilter={{
          ...emptyFilter,
          friends: { ...emptyFilter.friends, wantToPlay: { min: 1 } },
        }}
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
  game: Game;
  status?: GameCollectionStatus;
  friendCollections?: StatusByUser;
} {
  return {
    game: collectedGame.game,
    status: collectedGame.status,
    friendCollections: {
      own: collectedGame.friendCollections
        ? collectedGame.friendCollections
            .filter((c) => c.status.own)
            .map((c) => c.user as PrivateUser)
        : [],
      wishlist: collectedGame.friendCollections
        ? collectedGame.friendCollections
            .filter((c) => c.status.wishlist)
            .map((c) => c.user as PrivateUser)
        : [],
      wantToPlay: collectedGame.friendCollections
        ? collectedGame.friendCollections
            .filter((c) => c.status.wantToPlay)
            .map((c) => c.user as PrivateUser)
        : [],
    },
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
