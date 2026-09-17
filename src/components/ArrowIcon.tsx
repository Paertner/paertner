type Direction = "up-right" | "down-right" | "up" | "right" | "left";

const paths: Record<Direction, string> = {
  "up-right": "M6 18 18 6M6 6h12v12",
  "down-right": "M6 6 18 18M6 18h12V6",
  up: "M12 20V4m-7 7 7-7 7 7",
  right: "M4 12h16m-7-7 7 7-7 7",
  left: "M20 12H4m7-7-7 7 7 7",
};

// Use vector paths so Apple Color Emoji cannot replace navigation arrows.
export default function ArrowIcon({
  direction = "up-right",
  size = "1em",
}: {
  direction?: Direction;
  size?: number | string;
}) {
  return (
    <svg
      className="arrow-icon"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={{ display: "inline-block", verticalAlign: "-0.125em", flexShrink: 0 }}
    >
      <path d={paths[direction]} />
    </svg>
  );
}
