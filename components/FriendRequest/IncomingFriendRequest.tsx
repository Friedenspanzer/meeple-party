import { Relationship, RelationshipType } from "@/datatypes/relationship";
import { useState } from "react";
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
  const [stale, setStale] = useState(false);

  return (
    <GenericFriendRequest request={request} stale={stale}>
      {updating ? (
        <div className="spinner-border spinner-border-sm" />
      ) : (
        <div className="btn-group" role="group">
          <button
            type="button"
            className="btn btn-danger"
            onClick={(_) => setUpdating(true)}
            disabled={updating}
          >
            <i className="bi bi-dash-circle"></i> Deny
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={(_) => setUpdating(true)}
            disabled={updating}
          >
            <i className="bi bi-check2"></i> Accept
          </button>
        </div>
      )}
    </GenericFriendRequest>
  );
};

export default IncomingFriendRequest;
