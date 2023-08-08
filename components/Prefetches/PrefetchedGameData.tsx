import { Game } from "@/datatypes/game";
import getQueryClient from "@/utility/queryClient";
import { dehydrate, Hydrate } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{ data: Game[] }>;

const PrefetchedGameData: React.FC<Props> = ({ data, children }) => {
  const queryClient = getQueryClient();
  data.forEach((g) => {
    queryClient.setQueryData(["game", g.id], g);
  });
  const dehydratedState = dehydrate(queryClient);
  queryClient.clear();
  return <Hydrate state={dehydratedState}>{children}</Hydrate>;
};

export default PrefetchedGameData;
