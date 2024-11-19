import useGameBoxSize, { GameBoxSize } from "@/lib/hooks/useGameBoxSize";
import { SegmentedControl } from "@mantine/core";
import IconGameBoxBig from "../../../../lib/icons/GameboxBig";
import IconGameBoxMedium from "../../../../lib/icons/GameboxMedium";

export default function GameBoxSizePicker({
  className,
}: Readonly<{
  className?: string;
}>) {
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
