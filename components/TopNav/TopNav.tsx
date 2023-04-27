"use client";

/* eslint-disable @next/next/no-html-link-for-pages */
import { useUser } from "@/context/userContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import FriendRequestsBadge from "../FriendRequestsBadge/FriendRequestsBadge";
import styles from "./topnav.module.css";
import Image from "next/image";
import Person from "../Person/Person";
import classNames from "classnames";

export default function TopNav() {
  const pathname = usePathname();
  const { user } = useUser();

  if (user) {
    return (
      <nav className="navbar navbar-expand-md bg-primary-subtle shadow-sm">
        <div className="container-fluid">
          <Image
            src="/logo.svg"
            width={100}
            height={100}
            alt="Meeple Party"
            className="navbar-brand"
          />
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li
                className={classNames("nav-item", {
                  active: pathname === "/app",
                })}
              >
                <Link href="/app" className="nav-link">
                  Dashboard
                </Link>
              </li>
              <li
                className={classNames("nav-item", {
                  active: pathname?.startsWith("/app/collection"),
                })}
              >
                <Link href="/app/collection" className="nav-link">
                  Collection
                </Link>
              </li>
              <li
                className={classNames("nav-item", {
                  active: pathname?.startsWith("/app/friends"),
                })}
              >
                <Link href="/app/friends" className="nav-link">
                  Friends&nbsp; <FriendRequestsBadge />
                </Link>
              </li>
            </ul>
            <div className={classNames("d-flex", styles.user)}>
              <Person
                name={user.name!}
                image={user.image || undefined}
                realName={user.realName || undefined}
              />
              <div className="dropdown">
                <button
                  className="btn btn-outline-primary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                ></button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link
                      href={`/app/profile/${user.id}`}
                      className="dropdown-item"
                    >
                      Your profile
                    </Link>
                  </li>
                  <li>
                    <Link href={`/app/profile/edit`} className="dropdown-item">
                      Edit your profile
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a href="/api/auth/signout" className="dropdown-item">
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  } else {
    return <></>;
  }
}
