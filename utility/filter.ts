import { GameCollectionFilterOptions } from "@/components/GameCollectionFilter/GameCollectionFilter";

export const emptyFilter: GameCollectionFilterOptions = {
  name: undefined,
  weight: { min: undefined, max: undefined },
  playingTime: { min: undefined, max: undefined },
  collectionStatus: {
    own: undefined,
    wantToPlay: undefined,
    wishlist: undefined,
  },
  playerCount: {
    type: "supports",
    count: undefined,
  },
  friends: {
    own: { min: undefined, max: undefined },
    wantToPlay: { min: undefined, max: undefined },
    wishlist: { min: undefined, max: undefined },
  },
  sort: "name",
};
