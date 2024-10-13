"use client";

import { Relationship, RelationshipType } from "@/datatypes/relationship";
import useRelationship from "@/hooks/api/useRelationship";
import { useTranslation } from "@/i18n/client";
import Spinner from "../Spinner/Spinner";
import GenericFriendRequest from "./GenericFriendRequest";

export interface SentFriendRequestProps {
  request: Relationship;
}

const SentFriendRequest: React.FC<SentFriendRequestProps> = ({ request }) => {
  if (request.type !== RelationshipType.FRIEND_REQUEST_SENT) {
    throw new Error("Wrong type for component SentFriendRequest");
  }

  const { deleteMutation, isLoading } = useRelationship(request.profile.id);
  const { t } = useTranslation();

  return (
    <GenericFriendRequest request={request}>
      {isLoading ? (
        <Spinner size="small" />
      ) : (
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => deleteMutation.mutate()}
          disabled={isLoading}
        >
          <i className="bi bi-trash"></i> {t("Actions.Withdraw")}
        </button>
      )}
    </GenericFriendRequest>
  );
};

export default SentFriendRequest;
