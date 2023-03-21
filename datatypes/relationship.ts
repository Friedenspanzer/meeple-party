import { PrivateUser, PublicUser } from "./userProfile";

export enum RelationshipType {
  FRIEND_REQUEST_SENT,
  FRIEND_REQUEST_RECEIVED,
  FRIENDSHIP,
}

export type Relationship = {
  profile: PrivateUser | PublicUser;
  type: RelationshipType;
  lastUpdate: Date;
};