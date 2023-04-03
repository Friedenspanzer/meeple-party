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
import { PrivateUser } from "@/datatypes/userProfile";
import CollectionStatusButtons from "../CollectionStatusButtons/CollectionStatusButtons";

export interface GameBoxProps {
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
}: GameBoxProps) {
  const [gameData, setGameData] = useState<Game>();
  const [friendCollections, setFriendCollections] = useState<StatusByUser>();

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

  useEffect(() => {
    if (typeof game === "number") {
      fetch(`/api/games/${game}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw Error(`${response.status} ${response.statusText}`);
          }
        })
        .then(setGameData)
        .catch((reason) => {
          throw Error(`Error loading data for game ${game}. Reason: ${reason}`);
        });
    } else {
      setGameData(game);
    }
  }, [game]);

  return gameData ? (
    <div className={styles.container}>
      <div className={styles.gamebox}>
        <div className={styles.imageBox}>
          <Link href={`/app/game/${gameData.id}`}>
            {!!gameData.image && (
              <Image
                src={gameData.image}
                className={`card-img-top ${styles.image}`}
                alt={gameData.name}
                width="200"
                height="150"
              />
            )}
          </Link>
        </div>
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
  ) : (
    <div className={classNames(styles.gamebox, "shimmer")} />
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

function UserList({ users }: { users: PrivateUser[] }) {
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
  user: PrivateUser;
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
