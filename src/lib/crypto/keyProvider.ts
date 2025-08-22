export interface KeyProvider {
  getKeyForCouple(coupleId: string): Promise<Uint8Array>;
}
