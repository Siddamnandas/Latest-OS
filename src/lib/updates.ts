// Utilities for checking and applying OTA updates via Expo EAS
// Uses dynamic imports so the web build does not require expo-updates

export async function checkExpoUpdate(): Promise<boolean> {
  // Skip expo-updates in web environment
  if (typeof window !== 'undefined' && !window.location.protocol.startsWith('http')) {
    return false;
  }
  
  try {
    // Only attempt to import expo-updates in native environments
    if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.includes('Expo')) {
      const Updates = await import(/* webpackIgnore: true */ 'expo-updates');
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        return true;
      }
    }
  } catch (err) {
    // Silently fail in web environments where expo-updates is not available
    console.warn('Failed to check for updates (expo-updates not available in web environment)', err);
  }
  return false;
}

export async function reloadExpoUpdate() {
  // Skip expo-updates in web environment
  if (typeof window !== 'undefined' && !window.location.protocol.startsWith('http')) {
    return;
  }
  
  try {
    // Only attempt to import expo-updates in native environments
    if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.includes('Expo')) {
      const Updates = await import(/* webpackIgnore: true */ 'expo-updates');
      await Updates.reloadAsync();
    }
  } catch (err) {
    // Silently fail in web environments where expo-updates is not available
    console.warn('Failed to reload update (expo-updates not available in web environment)', err);
  }
}