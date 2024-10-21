import useGameBoxSize, { GameBoxSize } from "@/hooks/useGameBoxSize";
import { SegmentedControl } from "@mantine/core";
import IconGameBoxBig from "../../../../components/icons/GameboxBig";
import IconGameBoxMedium from "../../../../components/icons/GameboxMedium";

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
