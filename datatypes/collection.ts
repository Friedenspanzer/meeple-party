import { Game } from "./game";
import { PrivateUser, PublicUser } from "./userProfile";

export interface StatusByUser {
  own: PrivateUser[];
  wishlist: PrivateUser[];
  wantToPlay: PrivateUser[];
}

export interface GameCollection {
  game: Game;
  status: {
    own: boolean;
    wantToPlay: boolean;
    wishlist: boolean;
  };
}

export interface UserGameCollection extends GameCollection {
  user: PrivateUser | PublicUser;
}
