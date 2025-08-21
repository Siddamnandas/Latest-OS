import * as LocalAuthentication from 'expo-local-authentication';

export async function promptBiometricAuth(promptMessage = 'Authenticate') {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) {
    return { success: false, error: 'Biometric hardware not available' } as const;
  }

  const enrolled = await LocalAuthentication.isEnrolledAsync();
  if (!enrolled) {
    return { success: false, error: 'No biometrics enrolled' } as const;
  }

  return LocalAuthentication.authenticateAsync({ promptMessage });
}

