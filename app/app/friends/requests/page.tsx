"use client";

import IncomingFriendRequest from "@/components/FriendRequest/IncomingFriendRequest";
import SentFriendRequest from "@/components/FriendRequest/SentFriendRequest";
import { RelationshipType } from "@/datatypes/relationship";
import useRelationships from "@/hooks/api/useRelationships";
import { useTranslation } from "@/i18n/client";

const FriendRequests: React.FC = () => {
  const { isLoading, data: relationships } = useRelationships();
  const { t } = useTranslation("friends");

  return (
    <>
      <h2>{t("Requests.Incoming")}</h2>
      <div className="container-md">
        {relationships
          ?.filter((r) => r.type === RelationshipType.FRIEND_REQUEST_RECEIVED)
          .map((r) => (
            <IncomingFriendRequest request={r} key={r.profile.id} />
          ))}
      </div>
      <h2>{t("Requests.Outgoing")}</h2>
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
