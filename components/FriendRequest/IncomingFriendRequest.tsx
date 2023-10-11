"use client";

import { Relationship, RelationshipType } from "@/datatypes/relationship";
import useRelationship from "@/hooks/useRelationship";
import { useTranslation } from "@/i18n/client";
import axios from "axios";
import { useCallback, useState } from "react";
import Spinner from "../Spinner/Spinner";
import GenericFriendRequest from "./GenericFriendRequest";

export interface IncomingFriendRequestProps {
  request: Relationship;
}

const IncomingFriendRequest: React.FC<IncomingFriendRequestProps> = ({
  request,
}) => {
  if (request.type !== RelationshipType.FRIEND_REQUEST_RECEIVED) {
    throw new Error("Wrong type for component IncomingFriendRequest");
  }
  const [updating, setUpdating] = useState(false);
  const { invalidate } = useRelationship(request.profile.id);
  const { t } = useTranslation();

  const denyRequest = useCallback(() => {
    setUpdating(true);
    axios
      .delete(`/api/relationships/${request.profile.id}`)
      .then(() => {
        setUpdating(false);
        invalidate();
      })
      .catch((reason) => {
        setUpdating(false);
        console.error(reason);
      });
  }, [request, invalidate]);

  const acceptRequest = useCallback(() => {
    setUpdating(true);
    axios
      .patch(`/api/relationships/${request.profile.id}`)
      .then(() => {
        setUpdating(false);
        invalidate();
      })
      .catch((reason) => {
        setUpdating(false);
        console.error(reason);
      });
  }, [request, invalidate]);

  return (
    <GenericFriendRequest request={request}>
      {updating ? (
        <Spinner size="small" />
      ) : (
        <div className="btn-group" role="group">
          <button
            type="button"
            className="btn btn-danger"
            onClick={(_) => denyRequest()}
            disabled={updating}
          >
            <i className="bi bi-dash-circle"></i> {t("Actions.Deny")}
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={(_) => acceptRequest()}
            disabled={updating}
          >
            <i className="bi bi-check2"></i> {t("Actions.Accept")}
          </button>
        </div>
      )}
    </GenericFriendRequest>
  );
};

export default IncomingFriendRequest;
