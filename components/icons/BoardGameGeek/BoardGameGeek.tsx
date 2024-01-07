interface IconBoardGameGeekProps {
  height?: number | string;
  color?: string;
  paddingInline?: string | number;
}
export default function IconBoardGameGeek({
  height = 24,
  color = "#FF5100",
  paddingInline = "0.25rem",
}: IconBoardGameGeekProps) {
  return (
    <svg
      height={height}
      viewBox="0 0 1607 2400"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        fillRule: "evenodd",
        clipRule: "evenodd",
        strokeLinejoin: "round",
        strokeMiterlimit: 2,
        paddingInline,
      }}
    >
      <path
        d="M437.589,2400l-434.954,-1038.25l157.57,-145.835l-93.012,-665.215l1477.05,-548.411l-186.941,503.89l224.091,-64.13l-103.065,771.487l128.669,126.583l-280.732,719.587l-888.679,340.29Z"
        style={{ fillRule: "nonzero" }}
        fill={color}
      />
    </svg>
  );
}
