"use client"

import { useEffect, useState } from "react"
import { featureClient } from "./config"
import { isFeatureEnabled } from "./utils"

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