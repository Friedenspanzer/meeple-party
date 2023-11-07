import {
  RelationshipDeleteResult,
  RelationshipGetResult,
} from "@/app/api/v2/relationship/[userId]/route";
import { Relationship } from "@/datatypes/relationship";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { DeleteableResult } from "./types";
import useRelationships from "./useRelationships";

export default function useRelationship(
  userId: string
): DeleteableResult<Relationship> {
  const { invalidate: invalidateRelationships } = useRelationships();

  const queryKey = ["relationship", userId];
  const queryClient = useQueryClient();
  const {
    isLoading: queryLoading,
    isError: queryError,
    data,
  } = useQuery({
    queryKey,
    queryFn: () => {
      return axios
        .get<RelationshipGetResult>(`/api/v2/relationship/${userId}`, {
          validateStatus: (status) => {
            return (status >= 200 && status < 300) || status === 404;
          },
        })
        .then((response) => {
          if (response.status === 404) {
            return null;
          } else {
            return response.data.normalizedRelationship;
          }
        });
    },
  });

  const {
    isLoading: mutationLoading,
    isError: mutationError,
    mutate: deleteFunction,
  } = useMutation({
    mutationKey: queryKey,
    mutationFn: () => {
      return axios
        .delete<RelationshipDeleteResult>(`/api/v2/relationship/${userId}`)
        .then(() => undefined);
    },
    onSuccess: () => {
      queryClient.setQueryData(queryKey, undefined);
      invalidateRelationships();
    },
  });

  return {
    isLoading: queryLoading || mutationLoading,
    isError: queryError || mutationError,
    data,
    invalidate: () => {
      queryClient.invalidateQueries({ queryKey: ["relationships"] });
      queryClient.invalidateQueries({ queryKey });
    },
    deleteFunction,
  };
}
