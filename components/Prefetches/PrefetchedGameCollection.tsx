import { useCollectionStatusQueryKey } from "@/hooks/api/useCollectionStatus";
import getQueryClient from "@/utility/queryClient";
import { Game, GameCollection } from "@prisma/client";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  data: (GameCollection & {
    game: Game;
  })[];
}>;

const PrefetchedGameCollection: React.FC<Props> = ({ data, children }) => {
  const queryClient = getQueryClient();
  const key = useCollectionStatusQueryKey();
  data.forEach((c) => {
    queryClient.setQueryData(key(c.game.id), c);
  });
  const dehydratedState = dehydrate(queryClient);
  queryClient.clear();
  return <Hydrate state={dehydratedState}>{children}</Hydrate>;
};

export default PrefetchedGameCollection;
