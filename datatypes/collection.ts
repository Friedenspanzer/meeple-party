import { PrivateUser } from "./userProfile";

export interface StatusByUser {
  own: PrivateUser[];
  wishlist: PrivateUser[];
  wantToPlay: PrivateUser[];
}