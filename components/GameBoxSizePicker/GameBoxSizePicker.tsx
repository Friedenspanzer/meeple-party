import useGameBoxSize, { GameBoxSize } from "@/hooks/useGameBoxSize";
import { SegmentedControl } from "@mantine/core";

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
        { label: "MD", value: "md" },
        { label: "XL", value: "xl" },
      ]}
      className={className}
    />
  );
}
