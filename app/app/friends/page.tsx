import GamePill from "@/components/GamePill/GamePill";
import Person from "@/components/Person/Person";
import { prisma } from "@/db";
import { getFriends } from "@/selectors/relationships";
import { getServerUser } from "@/utility/serverSession";
import classNames from "classnames";
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
    take: 50,
    include: { user: true, game: true },
  });
  return (
    <>
      <h2>Your friend&apos;s collection updates</h2>
      {myFriends.map((friend) => {
        const friendUpdates = collectionUpdates.filter(
          (u) => u.userId === friend.id
        );
        const friendOwns = friendUpdates
          .filter((u) => u.own)
          .map((u) => u.game);
        const friendWantsToPlay = friendUpdates
          .filter((u) => u.wantToPlay)
          .map((u) => u.game);
        return (
          <div className={classNames("card", styles.card)} key={friend.id}>
            <div className="card-header">
              <Person
                key={friend.id}
                name={friend.name!}
                realName={friend.realName || undefined}
                image={friend.image || undefined}
              />
            </div>
            <div className="card-body">
              {friendOwns.length > 0 && (
                <>
                  <h4>Owns</h4>
                  {friendOwns.map((g) => (
                    <Link
                      href={`/app/game/${g.id}`}
                      key={g.id}
                      className={styles.link}
                    >
                      <GamePill game={g} />
                    </Link>
                  ))}
                </>
              )}
              {friendWantsToPlay.length > 0 && (
                <>
                  <h4 className={styles.wantToPlay}>Wants to play</h4>
                  {friendWantsToPlay.map((g) => (
                    <Link
                      href={`/app/game/${g.id}`}
                      key={g.id}
                      className={styles.link}
                    >
                      <GamePill game={g} />
                    </Link>
                  ))}
                </>
              )}
            </div>
          </div>
        );
      })}
      <h2>All your friends</h2>
    </>
  );
}
