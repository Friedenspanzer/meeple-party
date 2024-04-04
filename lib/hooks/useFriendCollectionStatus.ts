import { FriendCollectionGetResult } from "@/app/api/v2/game/[gameId]/friends/route";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useFriendCollectionStatus(gameId: number) {
  const queryKey = ["friendcollectionstatus", gameId];
  const { isLoading, isError, data } = useQuery({
    queryKey,
    queryFn: () => {
      return axios
        .get<FriendCollectionGetResult>(`/api/v2/game/${gameId}/friends`)
        .then((response) => response.data);
    },
  });
  return { isLoading, isError, data };
}
