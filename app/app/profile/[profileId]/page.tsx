import Avatar from "@/components/Avatar/Avatar";
import GameBox from "@/components/GameBox/GameBox";
import GameCollection from "@/components/GameCollection/GameCollection";
import Role from "@/components/Role/Role";
import { prisma } from "@/db";
import { getServerUser } from "@/utility/serverSession";
import { Game, Relationship, RelationshipType, User } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProfileRelationship from "./components/relationship";
import styles from "./profilepage.module.css";

type UserWithRelationships = User & {
  sentRelationships: Relationship[];
  receivedRelationships: Relationship[];
};

export default async function ProfilePage({
  params,
}: {
  params: { profileId: string };
}) {
  const user = await prisma.user.findUnique({
    where: { id: params.profileId },
    include: {
      receivedRelationships: true,
      sentRelationships: true,
      favorites: true,
      games: {
        where: {
          own: true,
        },
        include: {
          game: true,
        },
      },
    },
  });
  if (!user) {
    notFound();
  }

  const loggedInUser = await getServerUser();

  const isMe = loggedInUser.id === user.id;
  const isFriend = getAllFriendIds(user).includes(loggedInUser.id);

  const moreHeaders = getMoreHeaders(user);

  return (
    <div className={styles.profile}>
      <Avatar
        image={user.image}
        name={user.name || ""}
        className={styles.avatar}
      />
      <h1 className={styles.name}>{user.name}</h1>
      {(isFriend || isMe) && (
        <h2 className={styles.realName}>{user.realName}</h2>
      )}
      {(isFriend || isMe) && !!moreHeaders && (
        <div
          className={styles.moreHeader}
          dangerouslySetInnerHTML={{ __html: moreHeaders }}
        />
      )}
      <div className={styles.roles}>
        <Role role={user.role} />
        {isMe && (
          <span className="badge text-bg-light">
            <i className="bi bi-person-circle"></i> It&apos;s you!
          </span>
        )}
        {isFriend && (
          <span className="badge text-bg-dark">
            <i className="bi bi-person-fill"></i> Friend
          </span>
        )}
      </div>
      {!isMe && !isFriend && (
        <div className={styles.action}>
          <ProfileRelationship targetUserId={user.id} />
        </div>
      )}
      {isMe && (
        <div className={styles.action}>
          <Link
            className="btn btn-primary"
            href="/app/profile/edit"
            role="button"
          >
            Edit your profile
          </Link>
        </div>
      )}
      <div className={styles.content}>
        <div className={styles.about}>
          {!!user.about && (
            <>
              <h3>About</h3>
              <p>{user.about}</p>
            </>
          )}
          {!!user.preference && (
            <>
              <h3>What I like</h3>
              <p>{user.preference}</p>
            </>
          )}
        </div>
        {user.favorites.length > 0 && (
          <div className={styles.favorites}>
            <h3>Favorite games</h3>
            {user.favorites.slice(0, 6).map((g) => (
              <GameBox game={g} key={g.id} showFriendCollection={false} />
            ))}
          </div>
        )}
      </div>
      {(isFriend || isMe) && (
        <GameCollection
          games={user.games
            .sort((a, b) => (a.game.name > b.game.name ? 1 : -1))
            .map(({ game, own, wantToPlay, wishlist }) => ({
              game: cleanGame(game),
              status: {
                own,
                wantToPlay,
                wishlist,
              },
            }))}
          className={styles.collection}
          showFriendCollection={false}
        >
          <h3>{user.name}&#39;s collection</h3>
        </GameCollection>
      )}
    </div>
  );
}

function getAllFriendIds(user: UserWithRelationships): string[] {
  const sentFriendships = user.sentRelationships
    .filter((r) => r.type === RelationshipType.FRIENDSHIP)
    .map((r) => r.recipientId);
  const receivedFriendships = user.receivedRelationships
    .filter((r) => r.type === RelationshipType.FRIENDSHIP)
    .map((r) => r.senderId);
  return [...sentFriendships, ...receivedFriendships];
}

function getMoreHeaders(user: User): string | undefined {
  if (!user.place && !user.bggName) {
    return;
  }
  const headers = [];
  if (!!user.place) {
    headers.push(`From <strong>${user.place}</strong>`);
  }
  if (!!user.bggName) {
    headers.push(`<strong>${user.bggName}</strong> on BoardGameGeek`);
  }
  return headers.join(" &bullet; ");
}

function cleanGame(game: Game) {
  const { updatedAt, ...cleanGame } = game;
  return cleanGame;
}
