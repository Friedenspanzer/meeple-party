"use client";

import { Relationship, RelationshipType } from "@/datatypes/relationship";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  NavigationBar,
  NavigationItem,
} from "@/components/NavigationBar/NavigationBar";

const Navbar: React.FC = ({}) => {
  const [relationships, setRelationships] = useState<Relationship[]>();

  useEffect(() => {
    fetch("/api/relationships/normalizedRelationships")
      .then((result) => result.json())
      .then(setRelationships);
  }, []);

  return (
    <NavigationBar>
      <NavigationItem href="/app/friends">Activity</NavigationItem>
      <NavigationItem href="/app/friends/requests">
        Your requests
        {!!relationships && (
          <>
            &nbsp;
            <span className="badge rounded-pill text-bg-secondary">
              {requestCount(relationships)}
            </span>
          </>
        )}
      </NavigationItem>
    </NavigationBar>
  );
};

function requestCount(relationships: Relationship[]): number {
  return relationships.filter(
    (r) => r.type === RelationshipType.FRIEND_REQUEST_RECEIVED
  ).length;
}

export default Navbar;
