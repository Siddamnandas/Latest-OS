import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { featureClient } from "./config"
import { useEffect, useState } from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isFeatureEnabled(name: string) {
  return featureClient?.isEnabled(name) ?? false
}

export function useFeatureFlag(name: string) {
  const [enabled, setEnabled] = useState<boolean>(false)
  useEffect(() => {
    setEnabled(isFeatureEnabled(name))
  }, [name])
  return enabled
}
