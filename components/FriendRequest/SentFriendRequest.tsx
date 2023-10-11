"use client";

import { Relationship, RelationshipType } from "@/datatypes/relationship";
import useRelationship from "@/hooks/useRelationship";
import { useTranslation } from "@/i18n/client";
import axios from "axios";
import { useCallback, useState } from "react";
import Spinner from "../Spinner/Spinner";
import GenericFriendRequest from "./GenericFriendRequest";

export interface SentFriendRequestProps {
  request: Relationship;
}

const SentFriendRequest: React.FC<SentFriendRequestProps> = ({ request }) => {
  if (request.type !== RelationshipType.FRIEND_REQUEST_SENT) {
    throw new Error("Wrong type for component SentFriendRequest");
  }

  const [updating, setUpdating] = useState(false);
  const { invalidate } = useRelationship(request.profile.id);
  const { t } = useTranslation();

  const withdrawRequest = useCallback(() => {
    setUpdating(true);
    axios
      .delete(`/api/relationships/${request.profile.id}`)
      .then(() => {
        setUpdating(false);
        invalidate();
      })
      .catch((reason) => {
        console.error(reason);
      });
  }, [request, invalidate]);

  return (
    <GenericFriendRequest request={request}>
      {updating ? (
        <Spinner size="small" />
      ) : (
        <button
          type="button"
          className="btn btn-danger"
          onClick={withdrawRequest}
          disabled={updating}
        >
          <i className="bi bi-trash"></i> {t("Actions.Withdraw")}
        </button>
      )}
    </GenericFriendRequest>
  );
};

export default SentFriendRequest;
