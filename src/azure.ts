import { BaseClaims, Verifier } from "./jwt";

export interface AzureClaim extends BaseClaims {
  /**
   * This is the user email and name in token
   */
  name: string;
  preferred_username: string;
  aud: string; // This is AppId of Azure AD
}

export class AzureVerifier extends Verifier<AzureClaim> {
  private tenantId: string;

  constructor(params: { tenantId: string; disableCaching: boolean }) {
    if (!params.tenantId) throw Error("tenantId param is required");

    super(
      `https://login.microsoftonline.com/${params.tenantId}/discovery/v2.0/keys`
    );
    this.tenantId = params.tenantId;
  }

  /**
   * Use this function to verify the Azure JWT token
   */
  async verify(token: string): Promise<boolean> {
    const claims = await this.getVerifiedToken(token);

    if (!claims.iss.includes(this.tenantId)) {
      throw Error("iss claim does not match with tenant ID.");
    }
    return true;
  }
}
