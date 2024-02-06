import { GameId } from "./game";
import { UserId } from "./userProfile";

export interface Collection {
  user: UserId;
  own: GameId[];
  wantToPlay: GameId[];
  wishlist: GameId[];
}