import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { featureClient } from "./config"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isFeatureEnabled(name: string) {
  return featureClient?.isEnabled(name) ?? false
}
