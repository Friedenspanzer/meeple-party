import Image from "next/image";
import { PropsWithChildren } from "react";
import styles from "./auth.module.css";

const AuthLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="container align-middle">
      <div className="row justify-content-center">
        <div className="col-md-3 text-center mt-5">
          <Image
            src="/logo.svg"
            width={300}
            height={300}
            alt="Meeple Party"
            className={styles.image}
          />
        </div>
      </div>
      {children}
    </div>
  );
};

export default AuthLayout;
