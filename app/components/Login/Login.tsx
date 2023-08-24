/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import Avatar from "@/components/Avatar/Avatar";
import { useUser } from "@/context/userContext";
import { useTranslation } from "@/i18n/client";
import classNames from "classnames";
import Link from "next/link";
import Spinner from "../../../components/Spinner/Spinner";
import styles from "./login.module.css";

const Login: React.FC = () => {
  const { user, loading } = useUser();
  const { t } = useTranslation();
  return (
    <div className={classNames("card", styles.card)}>
      <div className="card-body d-flex align-items-center justify-content-center flex-column">
        {!loading && user && (
          <>
            <Avatar name={user.name || ""} image={user.image} />
            <strong>{user.name}</strong>
            {user.realName ? <small>{user.realName}</small> : <br />}
            <Link href="/app" className="btn btn-primary mt-2">
              {t("Login.GoToApp")} <i className="bi bi-arrow-right-circle"></i>
            </Link>
            <a href="/api/auth/signout" className="btn btn-secondary mt-2">
              {t("Login.Logout")} <i className="bi bi-door-open"></i>
            </a>
          </>
        )}
        {!loading && !user && (
          <>
            <a className="btn btn-primary" href="/api/auth/signin">
              Login or Register
            </a>
          </>
        )}
        {loading && <Spinner />}
      </div>
    </div>
  );
};

export default Login;
