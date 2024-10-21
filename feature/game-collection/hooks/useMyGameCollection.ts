import { GameCollectionResult } from "@/app/api/v2/user/[userId]/collection/route";
import { Game } from "@/datatypes/game";
import { useUser } from "@/feature/authentication/context/userContext";
import { useGameQueryKey } from "@/feature/game-database/hooks/useGame";
import { Result } from "@/hooks/api/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useMemo } from "react";

interface MyGameCollection {
  gameId: number;
  own: boolean;
  wantToPlay: boolean;
  wishlist: boolean;
}

export function useMyGameCollection(): Result<MyGameCollection[]> {
  const { user, loading } = useUser();
  const queryClient = useQueryClient();
  const gameQueryKey = useGameQueryKey();
  const { isLoading, isError, data } = useQuery({
    queryKey: ["gamecollection", user?.id],
    queryFn: () => {
      if (user?.id) {
        return axios
          .get<GameCollectionResult>(`/api/v2/user/${user?.id}/collection`)
          .then((response) => response.data)
          .then((data) => {
            data.collection
              .map((c) => c.game)
              .forEach((game) =>
                queryClient.setQueryData<Game>(gameQueryKey(game.id), game)
              );
            return data.collection.map((c) => ({
              gameId: c.game.id,
              own: c.own,
              wantToPlay: c.wantToPlay,
              wishlist: c.wishlist,
            }));
          });
      } else {
        return [];
      }
    },
  });
  const value = useMemo<Result<MyGameCollection[]>>(() => {
    return {
      data,
      isLoading: isLoading || loading,
      isError,
      invalidate: () => {
        if (user?.id) {
          queryClient.invalidateQueries({
            queryKey: ["gamecollection", user.id],
          });
        }
      },
    };
  }, [isLoading, isError, data, queryClient, loading, user]);
  return value;
}
