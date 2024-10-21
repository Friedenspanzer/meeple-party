import { getCollectionStatusQueryKey } from "@/feature/game-collection/hooks/useCollectionStatus";
import getQueryClient from "@/utility/queryClient";
import { GameCollection } from "@prisma/client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  data: GameCollection[];
}>;

const PrefetchedGameCollection: React.FC<Props> = ({ data, children }) => {
  const queryClient = getQueryClient();
  data.forEach((c) => {
    queryClient.setQueryData(getCollectionStatusQueryKey(c.gameId), c);
  });
  const dehydratedState = dehydrate(queryClient);
  queryClient.clear();
  return (
    <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
  );
};

export default PrefetchedGameCollection;
