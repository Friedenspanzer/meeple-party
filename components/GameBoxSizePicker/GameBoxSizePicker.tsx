import useGameBoxSize, { GameBoxSize } from "@/hooks/useGameBoxSize";
import { SegmentedControl } from "@mantine/core";
import IconGameBoxBig from "../icons/GameboxBig";
import IconGameBoxMedium from "../icons/GameboxMedium";

export default function GameBoxSizePicker({
  className,
}: {
  className?: string;
}) {
  const [size, setSize] = useGameBoxSize();
  return (
    <SegmentedControl
      value={size}
      onChange={(value) => setSize(value as GameBoxSize)}
      data={[
        { label: <IconGameBoxMedium />, value: "md" },
        { label: <IconGameBoxBig />, value: "xl" },
      ]}
      className={className}
    />
  );
}
