"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useMagneticHover } from "@/lib/animations";

interface MagneticButtonProps {
  href?: string;
  type?: "button" | "submit";
  variant: "primary" | "secondary";
  size?: "sm" | "md";
  disabled?: boolean;
  target?: string;
  rel?: string;
  onClick?: () => void;
  "aria-label"?: string;
  children: ReactNode;
}

export function MagneticButton({
  href,
  type = "button",
  variant,
  size = "md",
  disabled = false,
  target,
  rel,
  children,
  ...rest
}: MagneticButtonProps) {
  const { ref, x, y, onMouseMove, onMouseLeave } = useMagneticHover<HTMLAnchorElement & HTMLButtonElement>(
    0.1,
    disabled,
  );

  const styles =
    variant === "primary"
      ? "bg-accent-light text-onyx hover:bg-foreground"
      : "border border-neutral/40 text-foreground hover:border-accent-light hover:text-accent-light";

  const sizeStyles = size === "sm" ? "px-5 py-2.5 text-sm" : "px-7 py-3.5 text-sm";
  const className = `cursor-pointer whitespace-nowrap rounded-full font-medium transition-colors ${sizeStyles} ${styles}`;

  if (href) {
    return (
      <motion.a
        ref={ref}
        href={href}
        target={target}
        rel={rel}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ x, y }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className={className}
        {...rest}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ x, y }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className={className}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
