import { Relationship } from "@/datatypes/relationship";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface Result {
  isLoading: boolean;
  isError: boolean;
  relationship: Relationship | undefined | null;
  invalidate: () => void;
}

export default function useRelationship(userId: string): Result {
  const queryKey = ["relationship", userId];
  const queryClient = useQueryClient();
  const { isLoading, isError, data } = useQuery({
    queryKey,
    queryFn: () => {
      return axios
        .get<Relationship[]>(`/api/relationships/${userId}`)
        .then((response) => response.data)
        .then((relationships) => {
          if (relationships.length === 1) {
            return relationships[0];
          } else {
            return null;
          }
        });
    },
  });

  return {
    isLoading,
    isError,
    relationship: data,
    invalidate: () => {
      queryClient.invalidateQueries({ queryKey: ["relationships"] });
      queryClient.invalidateQueries({ queryKey });
    },
  };
}
