"use client";

import IncomingFriendRequest from "@/components/FriendRequest/IncomingFriendRequest";
import SentFriendRequest from "@/components/FriendRequest/SentFriendRequest";
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

  const sendRequest = useCallback(() => {
    setUpdating(true);
    //TODO Error handling
    fetch(`/api/relationships/${profileId}`, {
      method: "POST",
    }).then(() => {
      setUpdating(false);
      setStale(true);
    });
  }, [profileId]);

  return updating ? (
    <div className="spinner-border spinner-border-sm" />
  ) : (
    <button
      type="button"
      className="btn btn-primary"
      onClick={sendRequest}
      disabled={updating || stale}
    >
      <i className="bi bi-people-fill"></i> Send friend request
    </button>
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
      {loading && <div className="spinner-border" />}
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
