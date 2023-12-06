import { useLocalStorage } from "@mantine/hooks";

export type GameBoxSize = "xl" | "md";

export default function useGameBoxSize() {
  return useLocalStorage<GameBoxSize>({
    key: "GameBoxSize",
    defaultValue: "xl",
  });
}
