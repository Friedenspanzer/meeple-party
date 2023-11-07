import { getCollectionStatusQueryKey } from "@/hooks/api/useCollectionStatus";
import getQueryClient from "@/utility/queryClient";
import { GameCollection } from "@prisma/client";
import { Hydrate, dehydrate } from "@tanstack/react-query";
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
  return <Hydrate state={dehydratedState}>{children}</Hydrate>;
};

export default PrefetchedGameCollection;
