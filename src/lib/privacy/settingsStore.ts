type PrivacySettings = {
  dataEncryption?: boolean;
  twoFactorAuth?: boolean;
  biometricLock?: boolean;
  autoLock?: boolean;
  screenshotProtection?: boolean;
  dataRetention?: number;
};

type Audit = {
  userId: string;
  type: string;
  action: string;
  timestamp: string;
  device?: string;
  location?: string;
  status: string;
};

const settingsMap = new Map<string, PrivacySettings>();
const audits: Audit[] = [];

export function getSettings(userId: string): PrivacySettings | null {
  return settingsMap.get(userId) || null;
}

export function setSettings(userId: string, settings: PrivacySettings) {
  settingsMap.set(userId, { ...(settingsMap.get(userId) || {}), ...settings });
}

export function getAudits(userId: string): Audit[] {
  return audits.filter(a => a.userId === userId).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export function addAudit(entry: Audit) {
  audits.push(entry);
}

