"use client";

import CriticalError from "@/components/CriticalError/CriticalError";
import IncomingFriendRequest from "@/components/FriendRequest/IncomingFriendRequest";
import SentFriendRequest from "@/components/FriendRequest/SentFriendRequest";
import Spinner from "@/components/Spinner/Spinner";
import { Relationship, RelationshipType } from "@/datatypes/relationship";
import { useCallback, useEffect, useState } from "react";

export interface ProfileRelationshipProps {
  targetUserId: string;
}

const SendFriendRequestButton: React.FC<{ profileId: string }> = ({
  profileId,
}) => {
  const [updating, setUpdating] = useState(false);
  const [stale, setStale] = useState(false);
  const [error, setError] = useState<string | false>(false);
  const [errorDetail, setErrorDetail] = useState<string>();

  const sendRequest = useCallback(() => {
    setUpdating(true);
    fetch(`/api/relationships/${profileId}`, {
      method: "POST",
    }).then((response) => {
      if (response.ok) {
        setUpdating(false);
        setStale(true);
      } else {
        setError("Error sending friend request.");
        setErrorDetail(`${response.status} ${response.statusText}`);
        setUpdating(false);
      }
    });
  }, [profileId]);

  return updating ? (
    <Spinner size="small" />
  ) : (
    <>
      {error && <CriticalError message={error} details={errorDetail} />}
      <button
        type="button"
        className="btn btn-primary"
        onClick={sendRequest}
        disabled={updating || stale}
      >
        <i className="bi bi-people-fill"></i> Send friend request
      </button>
    </>
  );
};

const ProfileRelationship: React.FC<ProfileRelationshipProps> = ({
  targetUserId,
}) => {
  const [loading, setLoading] = useState(true);
  const [relationship, setRelationship] = useState<Relationship>();

  useEffect(() => {
    fetch(`/api/relationships/${targetUserId}`)
      .then((response) => response.json())
      .then((result) => {
        if (result.length > 0) {
          setRelationship(result[0]);
        }
      })
      .then(() => setLoading(false));
  }, [targetUserId]);

  return (
    <>
      {loading && <Spinner />}
      {!loading && !relationship && (
        <SendFriendRequestButton profileId={targetUserId} />
      )}
      {!loading && relationship?.type === RelationshipType.FRIENDSHIP && (
        <h3>You are already friends</h3>
      )}
      {!loading &&
        relationship?.type === RelationshipType.FRIEND_REQUEST_SENT && (
          <>
            <h3>Your sent friend request</h3>
            <SentFriendRequest request={relationship} />
          </>
        )}
      {!loading &&
        relationship?.type === RelationshipType.FRIEND_REQUEST_RECEIVED && (
          <>
            <h3>Your received friend request</h3>
            <IncomingFriendRequest request={relationship} />
          </>
        )}
    </>
  );
};

export default ProfileRelationship;
