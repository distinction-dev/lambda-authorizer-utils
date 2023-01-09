import axios from "axios";
import * as jose from "node-jose";

export interface PublicKey {
  kid: string;
  alg: string;
  kty: string;
  e: string;
  n: string;
  use: string;
}

export interface BaseClaims {
  iss: string;
  /**
   * The time when the token would expire in seconds
   */
  exp: number;
}

export class Verifier<T extends BaseClaims> {
  publicKeys: Array<PublicKey> | null = null;
  /**
   * The url where the public key for the Cognito User Pool can be found
   * This is supposed to be a getter
   */
  keysUrl: string;
  disableCaching: boolean;

  constructor(keysUrl: string, disableCaching = false) {
    this.keysUrl = keysUrl;
    this.disableCaching = disableCaching;
  }

  private async getPublicKeys(): Promise<Array<PublicKey>> {
    if (!this.publicKeys) {
      if (!this.disableCaching) {
        this.publicKeys = await this.fetchKeys();
      }
      return await this.fetchKeys();
    }
    return this.publicKeys;
  }

  private async fetchKeys(): Promise<Array<PublicKey>> {
    return (
      await axios.get<{ keys: Array<PublicKey> }>(this.keysUrl, {
        timeout: 5000,
      })
    ).data.keys;
  }

  /**
   * Use this function to verify the Cognito token
   */
  async getVerifiedToken(token: string): Promise<T> {
    const sections = token.split(".");
    const header = JSON.parse(
      jose.util.base64url.decode(sections[0]).toString()
    );
    const kid = header.kid;

    const publicKeys = await this.getPublicKeys();
    const myPublicKey = publicKeys.find(k => k.kid === kid);

    if (!myPublicKey) {
      throw Error("Public key not found at " + this.keysUrl);
    }

    const joseKey = await jose.JWK.asKey(myPublicKey);

    const verifiedToken = await jose.JWS.createVerify(joseKey).verify(token);

    const claims = JSON.parse(verifiedToken.payload.toString()) as T;

    if (claims.exp < Number(new Date()) / 1000) {
      throw Error("Token is expired");
    }
    return claims;
  }
}
