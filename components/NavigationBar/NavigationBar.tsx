"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./navigationbar.module.css";

export interface NavigationBarProps {
  fill?: boolean;
  children: React.ReactNode;
}
export interface NavigationItemProps {
  href: string;
  children: React.ReactNode;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  fill = true,
  children,
}) => {
  return <ul className={`nav nav-pills ${fill && "nav-fill"}`}>{children}</ul>;
};

export const NavigationItem: React.FC<NavigationItemProps> = ({
  href,
  children,
}) => {
  const pathname = usePathname();

  return (
    <li className="nav-item">
      <Link href={href} className={`nav-link ${pathname === href && "active"} ${styles.bar}`}>
        {children}
      </Link>
    </li>
  );
};