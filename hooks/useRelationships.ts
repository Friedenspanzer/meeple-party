import { Relationship } from "@/datatypes/relationship";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface Result {
  isLoading: boolean;
  isError: boolean;
  relationships: Relationship[] | undefined;
  invalidate: () => void;
}

export default function useRelationships(): Result {
  const queryKey = ["relationships"];
  const queryClient = useQueryClient();
  const { isLoading, isError, data } = useQuery({
    queryKey,
    queryFn: () => {
      return axios
        .get<Relationship[]>("/api/relationships")
        .then((response) => response.data);
    },
  });

  return {
    isLoading,
    isError,
    relationships: data,
    invalidate: () => queryClient.invalidateQueries({ queryKey }),
  };
}
