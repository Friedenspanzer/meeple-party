import { RelationshipGetResult } from "@/app/api/v2/relationship/[userId]/route";
import { Relationship } from "@/datatypes/relationship";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Result } from "./types";

export default function useRelationship(userId: string): Result<Relationship> {
  const queryKey = ["relationship", userId];
  const queryClient = useQueryClient();
  const { isLoading, isError, data } = useQuery({
    queryKey,
    queryFn: () => {
      return axios
        .get<RelationshipGetResult>(`/api/v2/relationships/${userId}`)
        .then((response) => response.data)
        .then((relationship) => {
          return relationship.normalizedRelationship;
        });
    },
  });

  return {
    isLoading,
    isError,
    data,
    invalidate: () => {
      queryClient.invalidateQueries({ queryKey: ["relationships"] });
      queryClient.invalidateQueries({ queryKey });
    },
  };
}
