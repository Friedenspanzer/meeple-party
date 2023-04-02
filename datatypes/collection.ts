import { Game } from "./game";
import { PrivateUser, PublicUser } from "./userProfile";

export interface StatusByUser {
  own: PrivateUser[];
  wishlist: PrivateUser[];
  wantToPlay: PrivateUser[];
}

export type GameCollectionStatus = {
  own: boolean;
  wantToPlay: boolean;
  wishlist: boolean;
};

export interface GameCollection {
  game: Game;
  status: GameCollectionStatus;
}

export interface UserGameCollection extends GameCollection {
  user: PrivateUser | PublicUser;
}

export type FriendCollectionStatus = {
  own: PrivateUser[];
  wantToPlay: PrivateUser[];
  wishlist: PrivateUser[];
};

export interface ExtendedGameCollection extends GameCollection {
  friendCollections: FriendCollectionStatus;
}
