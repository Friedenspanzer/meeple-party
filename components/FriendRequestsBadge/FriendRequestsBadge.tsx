"use client";

import { Relationship, RelationshipType } from "@/datatypes/relationship";
import { useEffect, useState } from "react";

const FriendRequestsBadge: React.FC = () => {
  const [relationships, setRelationships] = useState<Relationship[]>();

  useEffect(() => {
    fetch("/api/relationships")
      .then((result) => result.json())
      .then((relationships: Relationship[]) =>
        relationships.filter(
          (r) => r.type === RelationshipType.FRIEND_REQUEST_RECEIVED
        )
      )
      .then(setRelationships);
  }, []);

  if (relationships && relationships.length > 0) {
    return (
      <span className="badge rounded-pill text-bg-secondary">
        {relationships.length}
      </span>
    );
  } else {
    return <></>;
  }
};

export default FriendRequestsBadge;
