import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { useEffect, useState } from "react"
import { featureClient } from "./config"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isFeatureEnabled(name: string) {
  return featureClient?.isEnabled(name) ?? false
}

export function useFeatureFlag(name: string) {
  const [enabled, setEnabled] = useState(isFeatureEnabled(name))

  useEffect(() => {
    if (!featureClient) return

    const update = () => setEnabled(featureClient.isEnabled(name))
    featureClient.on("ready", update)
    featureClient.on("update", update)

    return () => {
      featureClient.off("ready", update)
      featureClient.off("update", update)
    }
  }, [name])

  return enabled
}
