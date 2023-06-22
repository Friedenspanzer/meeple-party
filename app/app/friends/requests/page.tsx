"use client";

import IncomingFriendRequest from "@/components/FriendRequest/IncomingFriendRequest";
import SentFriendRequest from "@/components/FriendRequest/SentFriendRequest";
import { RelationshipType } from "@/datatypes/relationship";
import useRelationships from "@/hooks/useRelationships";

const FriendRequests: React.FC = (props) => {
  const { relationships } = useRelationships();

  return (
    <>
      <h2>Incoming requests</h2>
      <div className="container-md">
        {relationships
          ?.filter((r) => r.type === RelationshipType.FRIEND_REQUEST_RECEIVED)
          .map((r) => (
            <IncomingFriendRequest request={r} key={r.profile.id} />
          ))}
      </div>
      <h2>Sent requests</h2>
      <div className="container-md">
        {relationships
          ?.filter((r) => r.type === RelationshipType.FRIEND_REQUEST_SENT)
          .map((r) => (
            <SentFriendRequest request={r} key={r.profile.id} />
          ))}
      </div>
    </>
  );
};

export default FriendRequests;
