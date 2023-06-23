import { User } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface Result {
  isLoading: boolean;
  isError: boolean;
  userProfile: Omit<User, "preferences"> | undefined;
  invalidate: () => void;
}

export default function useUserProfile(): Result {
  const queryKey = ["user"];
  const queryClient = useQueryClient();
  const { isLoading, isError, data } = useQuery({
    queryKey,
    queryFn: () => {
      return axios.get<User>("/api/user").then((response) => response.data);
    },
  });

  return {
    isLoading,
    isError,
    userProfile: data,
    invalidate: () => queryClient.invalidateQueries({ queryKey }),
  };
}
