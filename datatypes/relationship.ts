import { PrivateUserProfile, PublicUserProfile } from "./userProfile";

export enum RelationshipType {
  FRIEND_REQUEST_SENT,
  FRIEND_REQUEST_RECEIVED,
  FRIENDSHIP,
}

export type Relationship = {
  profile: PrivateUserProfile | PublicUserProfile;
  type: RelationshipType;
  lastUpdate: Date;
};