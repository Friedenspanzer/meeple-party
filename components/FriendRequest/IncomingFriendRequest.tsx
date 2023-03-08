import { Relationship, RelationshipType } from "@/datatypes/relationship";
import GenericFriendRequest from "./GenericFriendRequest";

export interface IncomingFriendRequestProps {
  request: Relationship;
}

const IncomingFriendRequest: React.FC<IncomingFriendRequestProps> = (props) => {
  if (props.request.type !== RelationshipType.FRIEND_REQUEST_RECEIVED) {
    throw new Error("Wrong type for component IncomingFriendRequest");
  }
  return (
    <GenericFriendRequest request={props.request}>
      Eingehend
    </GenericFriendRequest>
  );
};

export default IncomingFriendRequest;
