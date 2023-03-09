"use client";

import { Relationship, RelationshipType } from "@/datatypes/relationship";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar: React.FC = ({}) => {
  const [relationships, setRelationships] = useState<Relationship[]>();
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/relationships/normalizedRelationships")
      .then((result) => result.json())
      .then(setRelationships);
  }, []);

  return (
    <ul className="nav nav-pills nav-fill">
      <li className="nav-item">
        <Link
          href="/app/friends"
          className={`nav-link ${pathname === "/app/friends" && "active"}`}
        >
          Activity
        </Link>
      </li>
      <li className="nav-item">
        <Link
          href="/app/friends/requests"
          className={`nav-link ${
            pathname === "/app/friends/requests" && "active"
          }`}
        >
          Your requests
          {!!relationships && (
            <>
              &nbsp;
              <span className="badge rounded-pill text-bg-secondary">
                {requestCount(relationships)}
              </span>
            </>
          )}
        </Link>
      </li>
    </ul>
  );
};

function requestCount(relationships: Relationship[]): number {
  return relationships.filter(
    (r) => r.type === RelationshipType.FRIEND_REQUEST_RECEIVED
  ).length;
}

export default Navbar;
