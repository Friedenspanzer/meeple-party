import { RelationshipsGetResult } from "@/app/api/v2/relationships/route";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { Result } from "./types";

export default function useRelationships(): Result<RelationshipsGetResult> {
  const queryKey = ["relationships"];
  const queryClient = useQueryClient();
  const { isLoading, isError, data } = useQuery({
    queryKey,
    queryFn: () => {
      return axios
        .get<RelationshipsGetResult>("/api/v2/relationships")
        .then((response) => response.data);
    },
  });

  useEffect(() => {
    if (data && data.normalizedRelationships) {
      data.normalizedRelationships.forEach((r) => {
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
