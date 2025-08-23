// Utilities for checking and applying OTA updates via Expo EAS
// Uses dynamic imports so the web build does not require expo-updates

import { logger } from '@/lib/logger';

export async function checkExpoUpdate(): Promise<boolean> {
  try {
    const Updates = await import(/* webpackIgnore: true */ 'expo-updates');
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      return true;
    }
  } catch (err) {
    logger.warn('Failed to check for updates', err);
  }
  return false;
}

export async function reloadExpoUpdate() {
  try {
    const Updates = await import(/* webpackIgnore: true */ 'expo-updates');
    await Updates.reloadAsync();
  } catch (err) {
    logger.warn('Failed to reload update', err);
  }
}