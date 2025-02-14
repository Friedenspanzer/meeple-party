import { RelationshipsGetResult } from "@/app/api/v2/relationships/route";
import { Result } from "@/lib/types/apiHooks";
import { Relationship } from "@/lib/types/relationship";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

export default function useRelationships(): Result<Relationship[]> {
  const queryKey = ["relationships"];
  const queryClient = useQueryClient();
  const { isLoading, isError, data } = useQuery({
    queryKey,
    queryFn: () => {
      return axios
        .get<RelationshipsGetResult>("/api/v2/relationships")
        .then((response) => response.data)
        .then((result) => result.normalizedRelationships);
    },
  });

  useEffect(() => {
    if (data) {
      data.forEach((r) => {
        queryClient.setQueryData(["relationship", r.profile.id], () => r);
      });
    }
  }, [data, queryClient]);

  return {
    isLoading,
    isError,
    data,
    invalidate: () => queryClient.invalidateQueries({ queryKey }),
  };
}
