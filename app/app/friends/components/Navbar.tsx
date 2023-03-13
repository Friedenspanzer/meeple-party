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
    fetch("/api/relationships/all")
      .then((result) => result.json())
      .then((relationships: Relationship[]) =>
        relationships.filter(
          (r) => r.type === RelationshipType.FRIEND_REQUEST_RECEIVED
        )
      )
      .then(setRelationships);
  }, []);

  return (
    <NavigationBar>
      <NavigationItem href="/app/friends">Activity</NavigationItem>
      <NavigationItem href="/app/friends/requests">
        Your requests
        {!!relationships && relationships.length > 0 && (
          <>
            &nbsp;
            <span className="badge rounded-pill text-bg-secondary">
              {relationships.length}
            </span>
          </>
        )}
      </NavigationItem>
    </NavigationBar>
  );
};

export default Navbar;
