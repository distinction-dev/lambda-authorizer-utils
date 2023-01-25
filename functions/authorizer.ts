import { APIGatewayRequestAuthorizerEvent } from "aws-lambda";
import { CustomClaims } from "functions/types";
import {
  AuthorizerResponse,
  AwsPolicy,
  DENY_ALL_RESPONSE,
  Verifier,
} from "src";

const verifier = new Verifier<CustomClaims>("");

// eslint-disable-next-line @typescript-eslint/require-await
export async function handler(
  event: APIGatewayRequestAuthorizerEvent
): Promise<AwsPolicy> {
  try {
    if (event.headers && event.headers.Authorization) {
      const claims = verifier.getParsedToken(event.headers.Authorization);
      const arnParts = AuthorizerResponse.parseApiGatewayArn(event.methodArn);
      const response = new AuthorizerResponse(
        "apigateway.amazonaws.com",
        arnParts.region,
        arnParts.awsAccountId,
        arnParts.apiId,
        arnParts.stage,
        false,
        {
          ...claims,
        }
      );
      if (claims.email === "superuser@distinction.dev") {
        response.allowAllRoutes();
      }
      if (claims.email === "admin@distinction.dev") {
        response.allowRoute("GET", "/hello");
        response.allowRoute("GET", "/variable/{id}");
      }
      return response.getPolicy();
    }
    return DENY_ALL_RESPONSE;
  } catch (err) {
    console.error(err);
    return DENY_ALL_RESPONSE;
  }
}
