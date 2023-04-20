import { Relationship, RelationshipType } from "@/datatypes/relationship";
import { useCallback, useState } from "react";
import CriticalError from "../CriticalError/CriticalError";
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
  const [stale, setStale] = useState(false);

  const [error, setError] = useState<string | false>(false);
  const [errorDetail, setErrorDetail] = useState<string>();

  const denyRequest = useCallback(() => {
    setUpdating(true);
    fetch(`/api/relationships/${request.profile.id}`, {
      method: "DELETE",
    }).then((response) => {
      if (response.ok) {
        setUpdating(false);
        setStale(true);
      } else {
        setError(`Error denying friend request.`);
        setErrorDetail(`${response.status} ${response.statusText}`);
      }
    });
  }, [request]);

  const acceptRequest = useCallback(() => {
    setUpdating(true);
    fetch(`/api/relationships/${request.profile.id}`, {
      method: "PATCH",
    }).then((response) => {
      if (response.ok) {
        setUpdating(false);
        setStale(true);
      } else {
        setError(`Error accepting friend request.`);
        setErrorDetail(`${response.status} ${response.statusText}`);
      }
    });
  }, [request]);

  if (error) {
    return <CriticalError message={error} details={errorDetail} />;
  }

  return (
    <GenericFriendRequest request={request} stale={stale}>
      {updating ? (
        <Spinner size="small" />
      ) : (
        <div className="btn-group" role="group">
          <button
            type="button"
            className="btn btn-danger"
            onClick={(_) => denyRequest()}
            disabled={updating || stale}
          >
            <i className="bi bi-dash-circle"></i> Deny
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={(_) => acceptRequest()}
            disabled={updating || stale}
          >
            <i className="bi bi-check2"></i> Accept
          </button>
        </div>
      )}
    </GenericFriendRequest>
  );
};

export default IncomingFriendRequest;
