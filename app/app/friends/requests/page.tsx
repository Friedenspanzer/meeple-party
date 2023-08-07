"use client";

import IncomingFriendRequest from "@/components/FriendRequest/IncomingFriendRequest";
import SentFriendRequest from "@/components/FriendRequest/SentFriendRequest";
import Spinner from "@/components/Spinner/Spinner";
import { RelationshipType } from "@/datatypes/relationship";
import useRelationships from "@/hooks/api/useRelationships";

const FriendRequests: React.FC = () => {
  const { isLoading, data: relationships } = useRelationships();

  if (isLoading) {
    return <Spinner />;
  }

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
