import Avatar from "@/components/Avatar/Avatar";
import Role from "@/components/Role/Role";
import { prisma } from "@/db";
import { getServerUser } from "@/utility/serverSession";
import { Relationship, RelationshipType, User } from "@prisma/client";
import classNames from "classnames";
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
      games: {
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

  return (
    <>
      <div className={styles.name}>
        <Avatar
          image={user.image}
          name={user.name || ""}
          className={styles.avatar}
        />
        <h1 className={styles.name}>{user.name}</h1>
        {(isFriend || isMe) && (
          <h2 className={styles.realName}>{user.realName}</h2>
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
      </div>
      {!isMe && !isFriend && <ProfileRelationship targetUserId={user.id} />}
    </>
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
