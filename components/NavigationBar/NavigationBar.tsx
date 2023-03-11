"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavigationBarProps {
  fill?: boolean;
  children: React.ReactNode;
}
export interface NavigationItemProps {
  href: string;
  children: React.ReactNode;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  fill,
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
      <Link href={href} className={`nav-link ${pathname === href && "active"}`}>
        {children}
      </Link>
    </li>
  );
};

NavigationBar.defaultProps = {
  fill: true,
};
