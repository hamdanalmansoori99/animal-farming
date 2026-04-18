type OrnamentProps = {
  variant?: "diamond" | "flourish";
  width?: number;
  className?: string;
};

/**
 * Decorative SVG divider used between sections in the editorial layout.
 * Single-color, inherits currentColor.
 */
export function Ornament({
  variant = "diamond",
  width = 120,
  className,
}: OrnamentProps) {
  if (variant === "flourish") {
    return (
      <svg
        viewBox="0 0 240 16"
        width={width}
        height={(width / 240) * 16}
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        role="presentation"
      >
        <line x1="10" y1="8" x2="100" y2="8" stroke="currentColor" strokeWidth="0.75" />
        <path
          d="M100 8 Q 110 2, 120 8 T 140 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.75"
        />
        <line x1="140" y1="8" x2="230" y2="8" stroke="currentColor" strokeWidth="0.75" />
        <circle cx="120" cy="8" r="1.4" fill="currentColor" />
      </svg>
    );
  }

  // diamond cluster: line — ◆ ✦ ◆ — line
  return (
    <svg
      viewBox="0 0 240 12"
      width={width}
      height={(width / 240) * 12}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="presentation"
    >
      <line x1="10" y1="6" x2="95" y2="6" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
      <path d="M105 6 L 110 1 L 115 6 L 110 11 Z" fill="currentColor" opacity="0.8" />
      <path d="M120 2 L121.2 4.8 L124 6 L121.2 7.2 L120 10 L118.8 7.2 L116 6 L118.8 4.8 Z" fill="currentColor" />
      <path d="M125 6 L 130 1 L 135 6 L 130 11 Z" fill="currentColor" opacity="0.8" />
      <line x1="145" y1="6" x2="230" y2="6" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
    </svg>
  );
}
