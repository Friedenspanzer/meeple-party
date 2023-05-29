import styles from "./changelog.module.css";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Changelog",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mb-5">
      <div className="row align-items-center">
        <div className="col-2">
          <Image src="/logo.svg" width={100} height={100} alt="Meeple Party" />
        </div>
        <div className="col">
          <h1 className="display-2">Changelog</h1>
          <Link href="/" className={styles.link}>
            <i className="bi bi-arrow-left"></i> Back to front page
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
