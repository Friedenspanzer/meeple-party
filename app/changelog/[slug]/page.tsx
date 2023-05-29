import { marked } from "marked";
import { notFound } from "next/navigation";
import { getUpdateMetadata, parseFile } from "../utils";
import Image from "next/image";
import classNames from "classnames";
import styles from "./update.module.css";
import Link from "next/link";

export default async function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  if (!slug) {
    notFound();
  }
  const fileName = `${slug}.md`;

  try {
    const update = parseFile(fileName);

    const content = marked(update.content, {
      mangle: false,
      headerIds: undefined,
      headerPrefix: undefined,
    });

    return (
      <>
        <div className="row justify-content-center">
          <div className="col-6">
            {update.image && (
              <Image
                src={`/images/changelog/${update.image}`}
                className={classNames("card-img-top", styles.image)}
                alt={update.title}
                height={1000}
                width={1000}
              />
            )}
            <h2>
              {update.title}{" "}
              <small className="text-body-secondary">{update.date}</small>
            </h2>
          </div>
        </div>
        <div className="row justify-content-center">
          <div
            className="col-6"
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
        </div>
        <div className="row justify-content-center">
          <div className="col-6">
            <Link href="/changelog">
              <i className="bi bi-arrow-left"></i> Back to the changelog
            </Link>
          </div>
        </div>
      </>
    );
  } catch (e) {
    console.log(e);
    notFound();
  }
}

export const generateStaticParams = async () => {
  return getUpdateMetadata().map((post) => ({
    params: {
      slug: post.slug,
    },
  }));
};
