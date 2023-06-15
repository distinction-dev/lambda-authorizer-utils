import "mocha";
import { expect } from "chai";
import { AzureVerifier, PublicKey } from "../src";
import * as jose from "node-jose";
import * as fs from "fs";
import path from "path";

// eslint-disable-next-line @typescript-eslint/no-misused-promises
describe("JWT Test Suite", async () => {
  try {
    console.log("started!!!!!!!!!!!!!!!!");

    const privateKey = await jose.JWK.asKey(
      fs.readFileSync(path.join(__dirname, "../private.pem")),
      "pem"
    );
    const publicKey = await jose.JWK.asKey(
      fs.readFileSync(path.join(__dirname, "../public.cer")),
      "pem"
    );

    const keys = (): Promise<Array<PublicKey>> => {
      return new Promise(resolve => {
        resolve([
          {
            kty: "",
            e: "",
            n: "",
            use: "",
            kid: "",
            alg: "",
            ...publicKey.toJSON(),
          },
        ]);
      });
    };

    const verifier = new AzureVerifier({
      tenantId: "fc6cb9f1-c3d0-4e45-8be4-5272c1cb5c59",
      disableCaching: false,
    });

    verifier.fetchKeys = async function (): Promise<Array<PublicKey>> {
      return await keys();
    };

    const payload = {
      email: "jay@distinction.dev",
      preferred_username: "jay@distinction.dev",
      groups: ["1c68c7fb-e0f6-497c-9375-6b89bcbd48fc"],
      roles: ["Write", "Admin"],
      aud: "a5c5107b-1258-4437-b212-aa1405593fbf",
      oid: "e9de1d8c-f6a4-44b2-857d-c188b7299953",
      iss: "fc6cb9f1-c3d0-4e45-8be4-5272c1cb5c59",
      exp: new Date().getTime() / 1000,
    };

    const opt = { compact: true, jwk: privateKey, fields: { typ: "jwt" } };
    const azurePassToken = await jose.JWS.createSign(opt, privateKey)
      .update(JSON.stringify(payload))
      .final();

    it("Valid Azure Token", async () => {
      const result = await verifier.verify(azurePassToken as any);
      expect(result).to.equal(true);
    });

    const azureFailToken = await jose.JWS.createSign(opt, privateKey)
      .update(JSON.stringify({ ...payload, iss: "adsasdasd" }))
      .final();

    it("Invalid Azure Token", async () => {
      const token = await verifier.verify(azureFailToken as any);
      expect(token).to.equal(false);
    });
  } catch (error) {
    console.log(error);
  }
});
