import Login from "@/app/Login/Login";
import classNames from "classnames";
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={classNames("container-fluid", styles.header)}>
      <div className="row align-items-center g-5 p-5">
        <div className="col-md-3">
          <Image
            src="/logo.svg"
            width={300}
            height={300}
            alt="Meeple Party"
            className={styles.image}
          />
        </div>
        <div className="col-md-6">
          <h1 className="display-1">Meeple Party</h1>
          <h2 className="display-6">
            The place to meet your friends for board games
          </h2>
        </div>
        <div className="col-md-3">
          <Login />
        </div>
      </div>
    </div>
  );
}
