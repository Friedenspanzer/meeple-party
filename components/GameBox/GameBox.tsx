"use client";

import { Game } from "@/datatypes/game";
import styles from "./gamebox.module.css";
import Link from "next/link";
import Image from "next/image";
import { CollectionStatus } from "@/pages/api/collection/[gameId]";
import { useEffect, useState } from "react";
import classNames from "classnames";
import Avatar from "../Avatar/Avatar";
import { StatusByUser } from "@/datatypes/collection";
import { UserProfile } from "@/datatypes/userProfile";
import CollectionStatusButtons from "../CollectionStatusButtons/CollectionStatusButtons";
import useGame from "@/hooks/api/useGame";

export interface GameBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  game: Game | number;
  status?: CollectionStatus;
  friendCollection?: StatusByUser;
  showFriendCollection: boolean;
}

export default function GameBox({
  game,
  status,
  friendCollection,
  showFriendCollection = false,
  className,
  ...props
}: GameBoxProps) {
  const [friendCollections, setFriendCollections] = useState<StatusByUser>();

  const { data: gameData, isLoading } = useGame(getGameId(game));

  useEffect(() => {
    if (showFriendCollection) {
      if (!friendCollection) {
        fetch(`/api/collection/friends/byGame/${getGameId(game)}`)
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw Error(`${response.status} ${response.statusText}`);
            }
          })
          .then(setFriendCollections)
          .catch((reason) => {
            throw Error(
              `Error loading friend collection data for game ${game}. Reason: ${reason}`
            );
          });
      } else {
        setFriendCollections(friendCollection);
      }
    }
  }, [game, friendCollection, showFriendCollection]);

  if (isLoading || !gameData) {
    return <div className={classNames(styles.gamebox, "shimmer")} />;
  }

  return (
    <div className={classNames(styles.container, className)} {...props}>
      <div className={styles.gamebox}>
        <Link href={`/app/game/${gameData.id}`}>
          <div className={styles.imageBox}>
            {!!gameData.thumbnail && (
              <Image
                src={gameData.thumbnail}
                className={`card-img-top ${styles.image}`}
                alt={gameData.name}
                width="200"
                height="150"
                unoptimized
              />
            )}
          </div>
        </Link>
        <div className={styles.title}>
          <h3 className="card-title">
            <Link href={`/app/game/${gameData.id}`}>{gameData.name}</Link>
          </h3>
        </div>
        <div className={styles.info}>
          <div className={styles.infoBox}>
            <div className={styles.metric}>
              {gameData.minPlayers === gameData.maxPlayers ? (
                gameData.minPlayers
              ) : (
                <>
                  {gameData.minPlayers}-{gameData.maxPlayers}
                </>
              )}
            </div>
            <div className={styles.label}>Players</div>
          </div>
          <div className={styles.infoBox}>
            <div className={styles.metric}>{gameData.playingTime}</div>
            <div className={styles.label}>Playing time</div>
          </div>
          <div className={styles.infoBox}>
            <div className={styles.metric}>{round(gameData.weight)}</div>
            <div className={styles.label}>Weight</div>
          </div>
        </div>
        <CollectionStatusButtons
          gameId={getGameId(game)}
          status={status}
          className={styles.collectionbuttons}
        />
      </div>
      {showFriendCollection && friendCollections && (
        <Link href={`/app/game/${gameData.id}`} className={styles.friends}>
          <div className={styles.collection}>
            <UserList users={friendCollections.own} />
          </div>
          <div className={styles.collection}>
            <UserList users={friendCollections.wantToPlay} />
          </div>
          <div className={styles.collection}>
            <UserList users={friendCollections.wishlist} />
          </div>
        </Link>
      )}
    </div>
  );
}

function getGameId(game: Game | number) {
  if (typeof game === "number") {
    return game;
  }
  return game.id;
}

function round(x: number): number {
  return Math.round(x * 10) / 10;
}

function UserList({ users }: { users: UserProfile[] }) {
  return (
    <>
      {users.map((u, i) => (
        <CollectionAvatar user={u} index={i} key={i} />
      ))}
    </>
  );
}

function CollectionAvatar({
  user,
  index,
}: {
  user: UserProfile;
  index: number;
}) {
  return (
    <Avatar
      name={user.name || ""}
      image={user.image}
      key={user.id}
      className={styles.person}
      style={{ zIndex: index * -1 }}
    />
  );
}
