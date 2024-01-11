"use client";

import IncomingFriendRequest from "@/components/FriendRequest/IncomingFriendRequest";
import SentFriendRequest from "@/components/FriendRequest/SentFriendRequest";
import Spinner from "@/components/Spinner/Spinner";
import { RelationshipType } from "@/datatypes/relationship";
import useRelationship from "@/hooks/data/useRelationship";
import axios from "axios";
import { useCallback, useState } from "react";

export interface ProfileRelationshipProps {
  targetUserId: string;
}

const SendFriendRequestButton: React.FC<{ profileId: string }> = ({
  profileId,
}) => {
  const [updating, setUpdating] = useState(false);
  const { isLoading, invalidate } = useRelationship(profileId);

  const sendRequest = useCallback(() => {
    setUpdating(true);
    axios
      .post(`/api/relationships/${profileId}`)
      .then(() => {
        setUpdating(false);
        invalidate();
      })
      .catch((error) => {
        console.log(error);
        setUpdating(false);
        invalidate();
      });
  }, [profileId, invalidate]);

  return updating || isLoading ? (
    <Spinner size="small" />
  ) : (
    <>
      <button
        type="button"
        className="btn btn-primary"
        onClick={sendRequest}
        disabled={updating}
      >
        <i className="bi bi-people-fill"></i> Send friend request
      </button>
    </>
  );
};

const ProfileRelationship: React.FC<ProfileRelationshipProps> = ({
  targetUserId,
}) => {
  const { isLoading, data: relationship } = useRelationship(targetUserId);

  return (
    <>
      {isLoading && <Spinner />}
      {!isLoading && !relationship && (
        <SendFriendRequestButton profileId={targetUserId} />
      )}
      {!isLoading && relationship?.type === RelationshipType.FRIENDSHIP && (
        <h3>You are already friends</h3>
      )}
      {!isLoading &&
        relationship?.type === RelationshipType.FRIEND_REQUEST_SENT && (
          <>
            <h3>Your sent friend request</h3>
            <SentFriendRequest request={relationship} />
          </>
        )}
      {!isLoading &&
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
