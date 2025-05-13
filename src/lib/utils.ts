
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function rainbowText(text: string) {
  return <span className="rainbow-text-static">{text}</span>;
}

export function rainbowAnimatedText(text: string) {
  return <span className="rainbow-text">{text}</span>;
}
