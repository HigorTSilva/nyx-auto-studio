import type { SVGProps } from "react";

type LogoVariant = "default" | "inverted" | "mono";

interface LogoProps extends SVGProps<SVGSVGElement> {
  variant?: LogoVariant;
}

const HEXAGON_POINTS = "100,35 155,67 155,133 100,165 45,133 45,67";
const BAR_LEFT = { x: 71, y: 65, width: 12, height: 70 };
const BAR_RIGHT = { x: 117, y: 65, width: 12, height: 70 };
const DIAGONAL_POINTS = "83,65 95,65 129,135 117,135";

const VARIANT_COLORS: Record<LogoVariant, { hex: string; barLeft: string; barRight: string }> = {
  default: { hex: "#34A399", barLeft: "#34A399", barRight: "#0E5C58" },
  inverted: { hex: "#0E5C58", barLeft: "#0E5C58", barRight: "#0A0C0C" },
  mono: { hex: "currentColor", barLeft: "currentColor", barRight: "currentColor" },
};

export function Logo({ variant = "default", className, ...props }: LogoProps) {
  const colors = VARIANT_COLORS[variant];

  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label="Nyx Auto Studio"
      className={className}
      {...props}
    >
      <polygon points={HEXAGON_POINTS} fill="none" stroke={colors.hex} strokeWidth={4} />
      <rect {...BAR_LEFT} fill={colors.barLeft} />
      <rect {...BAR_RIGHT} fill={colors.barRight} />
      <polygon points={DIAGONAL_POINTS} fill={colors.barRight} />
    </svg>
  );
}
