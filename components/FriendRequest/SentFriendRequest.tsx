import { Relationship, RelationshipType } from "@/datatypes/relationship";
import { useCallback, useState } from "react";
import GenericFriendRequest from "./GenericFriendRequest";

export interface SentFriendRequestProps {
  request: Relationship;
}

const SentFriendRequest: React.FC<SentFriendRequestProps> = ({ request }) => {
  if (request.type !== RelationshipType.FRIEND_REQUEST_SENT) {
    throw new Error("Wrong type for component SentFriendRequest");
  }

  const [updating, setUpdating] = useState(false);
  const [stale, setStale] = useState(false);

  const withdrawRequest = useCallback(() => {
    setUpdating(true);
    //TODO Error handling
    fetch(`/api/relationships/${request.profile.id}`, {
      method: "DELETE",
    }).then(() => {
      setUpdating(false);
      setStale(true);
    });
  }, [request]);

  return (
    <GenericFriendRequest request={request} stale={stale}>
      {updating ? (
        <div className="spinner-border spinner-border-sm" />
      ) : (
        <button
          type="button"
          className="btn btn-danger"
          onClick={withdrawRequest}
          disabled={updating || stale}
        >
          <i className="bi bi-trash"></i> Withdraw
        </button>
      )}
    </GenericFriendRequest>
  );
};

export default SentFriendRequest;
