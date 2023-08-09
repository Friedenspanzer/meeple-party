import { UserProfile } from "./userProfile";

export enum RelationshipType {
  FRIEND_REQUEST_SENT,
  FRIEND_REQUEST_RECEIVED,
  FRIENDSHIP,
}

export type Relationship = {
  profile: UserProfile;
  type: RelationshipType;
  lastUpdate: Date;
};
