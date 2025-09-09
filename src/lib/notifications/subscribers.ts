// Simple in-memory stores for demo/testing. Replace with DB in production.
const webSubscriptions: any[] = [];
const expoPushTokens: string[] = [];

export function addWebSubscription(subscription: any) {
  webSubscriptions.push(subscription);
}

export function addExpoToken(token: string) {
  expoPushTokens.push(token);
}

export function getWebSubscriptions() {
  return webSubscriptions;
}

export function getExpoPushTokens() {
  return expoPushTokens;
}

