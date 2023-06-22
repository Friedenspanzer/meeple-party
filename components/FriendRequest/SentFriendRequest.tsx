import { Relationship, RelationshipType } from "@/datatypes/relationship";
import useRelationships from "@/hooks/useRelationships";
import axios from "axios";
import { useCallback, useState } from "react";
import CriticalError from "../CriticalError/CriticalError";
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
  const { invalidate } = useRelationships();

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
          <i className="bi bi-trash"></i> Withdraw
        </button>
      )}
    </GenericFriendRequest>
  );
};

export default SentFriendRequest;
