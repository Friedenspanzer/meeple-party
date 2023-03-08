import { Relationship, RelationshipType } from "@/datatypes/relationship";
import GenericFriendRequest from "./GenericFriendRequest";

export interface SentFriendRequestProps {
  request: Relationship;
}

const SentFriendRequest: React.FC<SentFriendRequestProps> = (props) => {
  if (props.request.type !== RelationshipType.FRIEND_REQUEST_SENT) {
    throw new Error("Wrong type for component SentFriendRequest");
  }
  return <GenericFriendRequest request={props.request}>Ausgehend</GenericFriendRequest>;
};

export default SentFriendRequest;
