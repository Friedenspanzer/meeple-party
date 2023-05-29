import Image from "next/image";
import styles from "./changelog.module.css";
import classNames from "classnames";
import { getUpdateMetadata } from "./utils";
import Link from "next/link";

export default async function Changelog() {
  const postList = getUpdateMetadata();

  postList.sort((a, b) => {
    if (a.date !== b.date) {
      return a.date > b.date ? -1 : 1;
    } else {
      return a.title > b.title ? -1 : 1;
    }
  });

  return (
    <div className="row mt-3 g-3">
      {postList.map((post) => (
        <div className="col-4" key={post.slug}>
          <div className="card text-bg-primary">
            {post.image && (
              <Link href={`/changelog/${post.slug}`}>
                <Image
                  src={`/images/changelog/${post.image}`}
                  className={classNames("card-img-top", styles.image)}
                  alt={post.title}
                  height={300}
                  width={300}
                />
              </Link>
            )}
            <div className="card-body">
              <Link href={`/changelog/${post.slug}`} className={styles.link}>
                <h3 className="card-title">
                  {post.title}
                  <br />
                  <small
                    className={classNames("text-body-secondary", styles.date)}
                  >
                    {post.date}
                  </small>
                </h3>
              </Link>
              <p className="card-text">{post.excerpt}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
