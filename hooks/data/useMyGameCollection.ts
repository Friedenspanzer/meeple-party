import { GameCollectionResult } from "@/app/api/v2/user/[userId]/collection/route";
import { useUser } from "@/context/userContext";
import { Game } from "@/datatypes/game";
import { useGameQueryKey } from "@/lib/hooks/data/useGame";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useMemo } from "react";
import { Result } from "./types";

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
