import { KMSClient, GenerateDataKeyCommand } from "@aws-sdk/client-kms";

export class KmsKeyProvider {
  constructor(
    private keyId: string,
    private client = new KMSClient({})
  ) {}

  async getKeyForCouple(_coupleId: string) {
    const res = await this.client.send(new GenerateDataKeyCommand({
      KeyId: this.keyId,
      KeySpec: "AES_256"
    }));
    if (!res.Plaintext) throw new Error("No key material");
    return res.Plaintext;
  }
}
