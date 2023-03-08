"use client";

import IncomingFriendRequest from "@/components/FriendRequest/IncomingFriendRequest";
import SentFriendRequest from "@/components/FriendRequest/SentFriendRequest";
import { Relationship, RelationshipType } from "@/datatypes/relationship";
import { useEffect, useState } from "react";

const FriendRequests: React.FC = (props) => {
  const [relationships, setRelationships] = useState<Relationship[]>();

  useEffect(() => {
    fetch("/api/relationships/normalizedRelationships")
      .then((result) => result.json())
      .then(setRelationships);
  }, []);

  return (
    <>
      <h2>Incoming requests</h2>
      {relationships
        ?.filter((r) => r.type === RelationshipType.FRIEND_REQUEST_RECEIVED)
        .map((r) => (
          <IncomingFriendRequest request={r} key={r.profile.id} />
        ))}
      <h2>Sent requests</h2>
      {relationships
        ?.filter((r) => r.type === RelationshipType.FRIEND_REQUEST_SENT)
        .map((r) => (
          <SentFriendRequest request={r} key={r.profile.id} />
        ))}
    </>
  );
};

export default FriendRequests;
