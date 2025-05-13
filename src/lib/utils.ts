
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import React from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Using string functions instead of JSX
export function getRainbowTextClass(): string {
  return "rainbow-text-static";
}

export function getRainbowAnimatedTextClass(): string {
  return "rainbow-text";
}

// If JSX is needed, can use these functions in TSX files
// Example usage: <span className={getRainbowTextClass()}>{text}</span>
