import Image from "next/image";
import { notFound } from "next/navigation";
import styles from "./gamepage.module.css";
import classNames from "classnames";
import { getBggGame } from "@/utility/bgg";
import BggRating from "@/components/BggRating/BggRating";
import { getCollectionStatusOfFriends } from "@/selectors/collections";
import { getServerUser } from "@/utility/serverSession";
import Avatar from "@/components/Avatar/Avatar";
import Link from "next/link";
import CollectionStatusButtons from "@/components/CollectionStatusButtons/CollectionStatusButtons";
import { Metadata, ResolvingMetadata } from "next/types";

export async function generateMetadata(
  { params }: { params: { gameId: string } }
): Promise<Metadata> {
  const id = Number.parseInt(params.gameId);
  if (!Number.isInteger(id)) {
    notFound();
  }
  const game = await getBggGame(id);
  return {
    title: game.name
  }
}

export default async function Game({ params }: { params: { gameId: string } }) {
  const id = Number.parseInt(params.gameId);
  if (!Number.isInteger(id)) {
    notFound();
  }
  try {
    const user = await getServerUser();
    const game = await getBggGame(id);
    const friendCollections = await getCollectionStatusOfFriends(id, user.id);
    const gameDesigners =
      game.designers.length <= 5
        ? game.designers
        : [
            ...game.designers.slice(0, 5),
            `... and ${game.designers.length - 5} more`,
          ];
    const gameArtists =
      game.artists.length <= 5
        ? game.artists
        : [
            ...game.artists.slice(0, 5),
            `... and ${game.artists.length - 5} more`,
          ];

    return (
      <div className={styles.container}>
        <div
          className={classNames(styles.header, {
            [styles.noImage]: !game.image,
          })}
        >
          {game.image && (
            <Image
              src={game.image}
              width={600}
              height={200}
              alt={game.name}
              className={styles.headerImage}
              unoptimized
            />
          )}
          <div
            className={classNames(styles.headerContent, {
              [styles.noImage]: !game.image,
            })}
          >
            {game.image && (
              <Image
                src={game.image || ""}
                width={200}
                height={200}
                alt={game.name}
                className={styles.titleImage}
                unoptimized
              />
            )}
            <div className={styles.headerInformation}>
              <BggRating
                rating={game.BGGRating}
                rank={game.BGGRank}
                className={styles.rating}
              />
              <h2 className={styles.gameName}>{game.name}</h2>
              <span className={styles.gameYear}>{game.year}</span>
              {gameDesigners.length > 0 && (
                <div className={classNames(styles.staff, styles.design)}>
                  <h3>Design</h3>
                  <ul>
                    {[...gameDesigners].reverse().map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}
              {gameArtists.length > 0 && (
                <div className={classNames(styles.staff, styles.art)}>
                  <h3>Art</h3>
                  <ul>
                    {[...gameArtists].reverse().map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div
                className={classNames(
                  styles.playerCount,
                  styles.additionalInfo
                )}
              >
                {game.maxPlayers === game.minPlayers
                  ? game.maxPlayers
                  : `${game.minPlayers}-${game.maxPlayers}`}
                <small>players</small>
              </div>
              <div
                className={classNames(
                  styles.playingTime,
                  styles.additionalInfo
                )}
              >
                {game.playingTime}
                <small>minutes</small>
              </div>
              <div className={classNames(styles.weight, styles.additionalInfo)}>
                {round(game.weight)}
                <small>weight</small>
              </div>
            </div>
          </div>
        </div>
        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: game.description }}
        ></div>
        <div className={styles.meta}>
          <h3>Your collection</h3>
          <div className={styles.group}>
            <CollectionStatusButtons gameId={game.id} />
          </div>
          {friendCollections.own.length > 0 && (
            <div className={styles.group}>
              <h3>Owned by</h3>
              {friendCollections.own.map((c) => (
                <Link href={`/app/profile/${c.id}`} key={c.id}>
                  <Avatar
                    name={c.name || ""}
                    image={c.image}
                    className={styles.avatar}
                  />
                </Link>
              ))}
            </div>
          )}
          {friendCollections.wantToPlay.length > 0 && (
            <div className={styles.group}>
              <h3>Want to play</h3>
              {friendCollections.wantToPlay.map((c) => (
                <Link href={`/app/profile/${c.id}`} key={c.id}>
                  <Avatar
                    name={c.name || ""}
                    image={c.image}
                    className={styles.avatar}
                  />
                </Link>
              ))}
            </div>
          )}
          {friendCollections.wishlist.length > 0 && (
            <div className={styles.group}>
              <h3>Wishlist</h3>
              {friendCollections.wishlist.map((c) => (
                <Link href={`/app/profile/${c.id}`} key={c.id}>
                  <Avatar
                    name={c.name || ""}
                    image={c.image}
                    className={styles.avatar}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } catch (e) {
    console.error("Error fetching game data", e);
    notFound();
  }
}

function round(i: number): number {
  return Math.round(i * 10) / 10;
}
