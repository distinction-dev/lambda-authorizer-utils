import { BaseClaims, Verifier } from "@/jwt";

export class Ws02Verifier<T extends BaseClaims> extends Verifier<T> {
  /**
   * BaseUrl for issuer host
   */
  private issuerHost: string;

  constructor(params: { issuerHost: string; disableCaching: boolean }) {
    if (!params.issuerHost) throw Error("Issuer host param is required");
    super(`${params.issuerHost}/oauth2/jwks`, params.disableCaching);
    this.issuerHost = params.issuerHost;
  }
}
