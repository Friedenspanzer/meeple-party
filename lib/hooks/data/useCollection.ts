import { Result } from "@/hooks/data/types";
import { Collection } from "@/lib/datatypes/client/collection";
import { UserId } from "@/lib/datatypes/client/userProfile";

export default function useCollection(userId: UserId): Result<Collection> {
  //TODO implement
  return {
    data: null,
    invalidate: () => {},
    isError: true,
    isLoading: false,
  };
}
