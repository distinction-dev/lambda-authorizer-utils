import { BaseClaims, Verifier } from "@/jwt";

export interface CognitoClaim extends BaseClaims {
  /**
   * This is the user id in the pool
   */
  sub: string;
  username: string;
}

export class CognitoVerifier extends Verifier<CognitoClaim> {
  private userPoolId: string;
  private region: string;

  constructor(params: {
    userPoolId: string;
    region: string;
    disableCaching: boolean;
  }) {
    if (!params.userPoolId) throw Error("userPoolId param is required");
    if (!params.region) throw Error("region param is required");
    super(
      `https://cognito-idp.${params.region}.amazonaws.com/${params.userPoolId}/.well-known/jwks.json`,
      params.disableCaching
    );
    this.userPoolId = params.userPoolId;
    this.region = params.region;
  }

  /**
   * Use this function to verify the Cognito token
   */
  async verify(token: string): Promise<boolean> {
    const claims = await this.getVerifiedToken(token);

    if (!claims.iss.endsWith(this.userPoolId)) {
      throw Error(
        "iss claim does not match user pool ID. This could mean that the user pool for key is different"
      );
    }
    return true;
  }
}
