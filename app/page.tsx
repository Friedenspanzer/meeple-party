import styles from "./page.module.css";
import Image from "next/image";
import LoginButtons from "@/components/LoginButtons/LoginButtons";

export default function Home() {
  return (
    <div className="container text-center">
      <div className="row justify-content-center mb-4">
        <div className="col-md-6">
          <Image
            src="/logo.svg"
            width={300}
            height={300}
            alt="Meeple Party"
            className={styles.image}
          />
        </div>
      </div>
      <div className="row justify-content-center mb-4">
        <div className="col-sm-6">
          Meeple Party is currently in closed Alpha. If you received an invite
          go on and register an account and then ask the administrator to unlock
          your account.
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <LoginButtons />
        </div>
      </div>
    </div>
  );
}
