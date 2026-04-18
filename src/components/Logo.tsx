type LogoProps = {
  size?: number;
  className?: string;
  /** Stroke/fill color — defaults to currentColor so it inherits text color. */
  color?: string;
  title?: string;
};

/**
 * Minimal SVG mark — a stylized falcon wing arc inside a soft diamond.
 * Single-color, scales to any size, inherits currentColor by default.
 * Replaceable later by /public/logo-mark.svg if the user provides one.
 */
export function Logo({ size = 28, className, color, title }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      {/* Diamond frame */}
      <path
        d="M16 2 L30 16 L16 30 L2 16 Z"
        stroke={color ?? "currentColor"}
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      {/* Falcon wing arc */}
      <path
        d="M9 19 C 13 13, 19 13, 23 11 C 21 17, 17 21, 11 22 Z"
        fill={color ?? "currentColor"}
        opacity="0.9"
      />
      {/* Eye dot */}
      <circle cx="20" cy="13" r="0.9" fill={color ?? "currentColor"} />
    </svg>
  );
}
