import { GameCollectionResult } from "@/app/api/v2/user/[userId]/collection/route";
import { useUser } from "@/context/userContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useMemo } from "react";
import { Result } from "./types";

export function useMyGameCollection(): Result<GameCollectionResult> {
  const { user, loading } = useUser();
  const queryClient = useQueryClient();
  const { isLoading, isError, data } = useQuery({
    queryKey: ["mygamecollection", loading],
    queryFn: () => {
      if (!loading) {
        return axios
          .get<GameCollectionResult>(`/api/v2/user/${user?.id}/collection`)
          .then((response) => response.data);
      } else {
        return {
          userId: "",
          collection: [],
        };
      }
    },
  });
  const value = useMemo<Result<GameCollectionResult>>(() => {
    return {
      data,
      isLoading: isLoading || loading,
      isError,
      invalidate: () => {
        if (!loading) {
          queryClient.invalidateQueries({
            queryKey: ["mygamecollection", true],
          });
        }
      },
    };
  }, [isLoading, isError, data, queryClient, loading]);
  return value;
}
