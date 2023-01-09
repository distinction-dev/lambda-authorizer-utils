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

export interface Claims {
  /**
   * This is the user id in the pool
   */
  sub: string;
  /**
   * The time when the token would expire in seconds
   */
  exp: number;
  /** */
  iss: string;
  username: string;
}

export class CognitoVerifier {
  private userPoolId: string;
  private region: string;
  private publicKeys: Array<PublicKey> | null = null;
  /**
   * The url where the public key for the Cognito User Pool can be found
   * This is supposed to be a getter
   */
  private keysUrl: string;

  constructor(params: { userPoolId: string; region: string }) {
    if (!params.userPoolId) throw Error("userPoolId param is required");
    if (!params.region) throw Error("region param is required");
    this.userPoolId = params.userPoolId;
    this.region = params.region;
    this.keysUrl = `https://cognito-idp.${this.region}.amazonaws.com/${this.userPoolId}/.well-known/jwks.json`;
  }

  private async getPublicKeys(): Promise<Array<PublicKey>> {
    if (!this.publicKeys) {
      this.publicKeys = await this.fetchKeys();
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
  async verify(token: string): Promise<boolean> {
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

    const claims = JSON.parse(verifiedToken.payload.toString()) as Claims;

    if (!claims.iss.endsWith(this.userPoolId)) {
      throw Error(
        "iss claim does not match user pool ID. This could mean that the user pool for key is different"
      );
    }

    if (claims.exp < Number(new Date()) / 1000) {
      throw Error("Token is expired");
    }
    return true;
  }
}
