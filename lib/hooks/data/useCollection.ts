import { GameCollectionResult } from "@/app/api/v2/user/[userId]/collection/route";
import { Result } from "@/hooks/data/types";
import getCollection from "@/lib/dataAccess/collection";
import { Collection } from "@/lib/datatypes/client/collection";
import { UserId } from "@/lib/datatypes/client/userProfile";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const thirtySecondsInMilliseconds = 1000 * 30;

export default function useCollection(userId: UserId): Result<Collection> {
  //TODO Cache game data
  const queryKey = ["collection", userId];
  const queryClient = useQueryClient();

  const { isLoading, isError, data } = useQuery({
    queryKey,
    queryFn: async () => getCollection(userId).then(convertCollection),
    refetchOnWindowFocus: true,
    staleTime: thirtySecondsInMilliseconds,
  });
  return {
    data,
    invalidate: () => {},
    isError,
    isLoading,
  };
}

function convertCollection(collection: GameCollectionResult): Collection {
  return {
    user: collection.userId,
    own: collection.collection.filter((c) => c.own).map((c) => c.game.id),
    wishlist: collection.collection
      .filter((c) => c.wishlist)
      .map((c) => c.game.id),
    wantToPlay: collection.collection
      .filter((c) => c.wantToPlay)
      .map((c) => c.game.id),
  };
}
