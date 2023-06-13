import "mocha";
import { create } from "njwt";
import { expect, assert } from "chai";
import { AzureVerifier, PublicKey } from "../src";
import * as jose from "node-jose";
import * as fs from "fs";
import path from "path";
// const payload = JSON.stringify({
//   exp: Math.floor((new Date().getTime() + 60 * 60 * 4) / 1000),
//   iat: Math.floor(Date.now() / 1000),
//   sub: "test",
// });
// const key = {
//   kty: "RSA",
//   use: "sig",
//   kid: "-KI3Q9nNR7bRofxmeZoXqbHZGew",
//   x5t: "-KI3Q9nNR7bRofxmeZoXqbHZGew",
//   n: "tJL6Wr2JUsxLyNezPQh1J6zn6wSoDAhgRYSDkaMuEHy75VikiB8wg25WuR96gdMpookdlRvh7SnRvtjQN9b5m4zJCMpSRcJ5DuXl4mcd7Cg3Zp1C5-JmMq8J7m7OS9HpUQbA1yhtCHqP7XA4UnQI28J-TnGiAa3viPLlq0663Cq6hQw7jYo5yNjdJcV5-FS-xNV7UHR4zAMRruMUHxte1IZJzbJmxjKoEjJwDTtcd6DkI3yrkmYt8GdQmu0YBHTJSZiz-M10CY3LbvLzf-tbBNKQ_gfnGGKF7MvRCmPA_YF_APynrIG7p4vPDRXhpG3_CIt317NyvGoIwiv0At83kQ",
//   e: "AQAB",
//   x5c: [
//     "MIIDBTCCAe2gAwIBAgIQGQ6YG6NleJxJGDRAwAd/ZTANBgkqhkiG9w0BAQsFADAtMSswKQYDVQQDEyJhY2NvdW50cy5hY2Nlc3Njb250cm9sLndpbmRvd3MubmV0MB4XDTIyMTAwMjE4MDY0OVoXDTI3MTAwMjE4MDY0OVowLTErMCkGA1UEAxMiYWNjb3VudHMuYWNjZXNzY29udHJvbC53aW5kb3dzLm5ldDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALSS+lq9iVLMS8jXsz0IdSes5+sEqAwIYEWEg5GjLhB8u+VYpIgfMINuVrkfeoHTKaKJHZUb4e0p0b7Y0DfW+ZuMyQjKUkXCeQ7l5eJnHewoN2adQufiZjKvCe5uzkvR6VEGwNcobQh6j+1wOFJ0CNvCfk5xogGt74jy5atOutwquoUMO42KOcjY3SXFefhUvsTVe1B0eMwDEa7jFB8bXtSGSc2yZsYyqBIycA07XHeg5CN8q5JmLfBnUJrtGAR0yUmYs/jNdAmNy27y83/rWwTSkP4H5xhihezL0QpjwP2BfwD8p6yBu6eLzw0V4aRt/wiLd9ezcrxqCMIr9ALfN5ECAwEAAaMhMB8wHQYDVR0OBBYEFJcSH+6Eaqucndn9DDu7Pym7OA8rMA0GCSqGSIb3DQEBCwUAA4IBAQADKkY0PIyslgWGmRDKpp/5PqzzM9+TNDhXzk6pw8aESWoLPJo90RgTJVf8uIj3YSic89m4ftZdmGFXwHcFC91aFe3PiDgCiteDkeH8KrrpZSve1pcM4SNjxwwmIKlJdrbcaJfWRsSoGFjzbFgOecISiVaJ9ZWpb89/+BeAz1Zpmu8DSyY22dG/K6ZDx5qNFg8pehdOUYY24oMamd4J2u2lUgkCKGBZMQgBZFwk+q7H86B/byGuTDEizLjGPTY/sMms1FAX55xBydxrADAer/pKrOF1v7Dq9C1Z9QVcm5D9G4DcenyWUdMyK43NXbVQLPxLOng51KO9icp2j4U7pwHP"
//   ],
//   issuer:
//     "https://login.microsoftonline.com/fc6cb9f1-c3d0-4e45-8be4-5272c1cb5c59/v2.0",
// };
// const opt = { compact: true, jwk: key, fields: { typ: "jwt" } };
// let joseToken: any;

// const token = await jose.JWS.createSign(opt, key as any)
// .update(payload)
// .final()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
describe("JWT Test Suite", async () => {
  try {
    console.log("started!!!!!!!!!!!!!!!!");

    const keys = (): Promise<Array<PublicKey>> => {
      return new Promise(resolve => {
        resolve([
          { kty: "", e: "", n: "", use: "", kid: "", ...publicKey.toJSON() },
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

    const privateKey = await jose.JWK.asKey(
      fs.readFileSync(path.join(__dirname, "../private.pem")),
      "pem"
    );
    const publicKey = await jose.JWK.asKey(
      fs.readFileSync(path.join(__dirname, "../public.cer")),
      "pem"
    );

    console.log({ privateKey, publicKey: publicKey.toJSON() });

    const payload = {
      email: "jay@distinction.dev",
      preferred_username: "jay@distinction.dev",
      groups: ["1c68c7fb-e0f6-497c-9375-6b89bcbd48fc"],
      roles: ["Write", "Admin"],
      aud: "a5c5107b-1258-4437-b212-aa1405593fbf",
      oid: "e9de1d8c-f6a4-44b2-857d-c188b7299953",
    };

    const azurePassToken = create(payload, privateKey.toJSON())
      .setHeader("kid", privateKey.kid)
      .setHeader("x5t", privateKey.kid);

    const opt = { compact: true, jwk: privateKey, fields: { typ: "jwt" } };
    const token = await jose.JWS.createSign(opt, privateKey)
      .update(JSON.stringify(payload))
      .final();

    console.log({ toekn: token, azurePassToken: azurePassToken.compact() });

    it("Valid Azure Token", async () => {
      const result = await verifier.verify(token as any);
      console.log("Valid: ", result);
      expect(result).to.equal(true);
    });

    // const azureFailToken = create(
    //   {
    //     email: "jay@distinction.dev",
    //   },
    //   "test-key"
    // ).compact();

    // it("Invalid Azure Token", async () => {
    //   const token = await verifier.verify(azureFailToken);
    //   console.log("Invalid: ", token);
    //   expect(token).to.equal(true);
    // });
  } catch (error) {
    console.log(error);
  }
});
