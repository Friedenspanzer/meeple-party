import CollectionChange from "@/components/CollectionChange/CollectionChange";
import Person from "@/components/Person/Person";
import { prisma } from "@/db";
import { getFriends } from "@/selectors/relationships";
import { getServerUser } from "@/utility/serverSession";
import { Game, GameCollection, User } from "@prisma/client";
import Link from "next/link";
import styles from "./friends.module.css";

export default async function Friends() {
  const user = await getServerUser();
  const myFriends = await getFriends(user.id);
  const collectionUpdates = await prisma.gameCollection.findMany({
    where: {
      OR: [{ wantToPlay: true }, { own: true }],
      userId: { in: myFriends.map((f) => f.id) },
    },
    orderBy: { updatedAt: "desc" },
    take: 20,
    include: { user: true, game: true },
  });
  let lastFriendId = "";
  return (
    <>
      <h2>Your friend&apos;s collection updates</h2>
      <div className="container">
        {collectionUpdates.map((update) => {
          const ret = (
            <div className="row" key={update.updatedAt?.toTimeString()}>
              <div className="col-lg-3">
                {update.userId !== lastFriendId && (
                  <Link
                    href={`/app/profile/${update.userId}`}
                    className={styles.link}
                  >
                    <Person
                      name={update.user.name!}
                      image={update.user.image || undefined}
                      className={styles.person}
                      realName={update.user.realName || undefined}
                    />
                  </Link>
                )}
              </div>
              <CollectionChange
                image={update.game.image!}
                operation="add"
                text={generateText(update)}
                own={update.own}
                wantToPlay={update.wantToPlay}
                wishlist={update.wishlist}
                className="col-lg-9"
                href={`/app/game/${update.gameId}`}
              />
            </div>
          );
          lastFriendId = update.userId;
          return ret;
        })}
      </div>
      <h2>All your friends</h2>
      <div className={styles.friendContainer}>
        {myFriends.map((friend) => (
          <Link
            href={`/app/profile/${friend.id}`}
            className={styles.link}
            key={friend.id}
          >
            <Person
              name={friend.name!}
              image={friend.image || undefined}
              realName={friend.realName || undefined}
              className={styles.listPerson}
            />
          </Link>
        ))}
      </div>
    </>
  );
}

function generateText(
  update: GameCollection & {
    user: User;
    game: Game;
  }
): string {
  const verbArray: string[] = [];
  if (update.own) {
    verbArray.push("owns");
  }
  if (update.wantToPlay) {
    verbArray.push("wants to play");
  }
  if (update.wishlist) {
    verbArray.push("wishes for");
  }
  return `${update.user.name} now ${joinVerbs(verbArray)} ${update.game.name}`;
}

function joinVerbs(verbs: string[]): string {
  if (verbs.length === 1) {
    return verbs[0];
  } else {
    const last = verbs.pop();
    return `${verbs.join(", ")} and ${last}`;
  }
}
