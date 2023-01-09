/**
 * Deny access to the api completely
 */
export const DENY_ALL_RESPONSE = {
  principalId: "deny-all-user",
  policyDocument: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: "Deny",
        Resource: ["*"],
      },
    ],
  },
};

export function buildRouteArn(
  region: string,
  awsAccountId: string,
  apiId: string,
  stage: string,
  method: string,
  path: string
): string {
  // Clean all starting / from path
  while (path.startsWith("/")) {
    path = path.substring(1, path.length);
  }
  return `arn:aws:execute-api:${region}:${awsAccountId}:${apiId}/${stage}/${method}/${path}`;
}

/**
 * Enum of Http Verbs
 */
export enum HttpVerbsEnum {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  HEAD = "HEAD",
  DELETE = "DELETE",
  OPTIONS = "OPTIONS",
  ALL = "*",
}
export type AwsPolicyCondition = Record<string, Record<string, string>>;
export type AwsRoute = {
  resourceArn: string;
  conditions?: Array<AwsPolicyCondition>;
};
export type AwsStatement = {
  Action: string;
  Effect: "Allow" | "Deny";
  Resource: Array<string>;
  Condition?: Array<AwsPolicyCondition>;
};
export type AwsPolicy = {
  principalId: string;
  policyDocument: {
    Version: "2012-10-17";
    Statement: Array<AwsStatement>;
  };
  usageIdentifierKey?: string;
  context?: Record<string, string | number | boolean>;
};

/**
 * Based on:- https://github.com/awslabs/aws-apigateway-lambda-authorizer-blueprints/blob/master/blueprints/nodejs/index.js
 * Documentation:-
 * - https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-lambda-authorizer.html
 * - https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-output.html
 */
export class AuthorizerResponse {
  /**
   * The regular expression used to validate resource paths for the policy
   */
  private readonly pathRegex = new RegExp("^[/.a-zA-Z0-9-_\\*]+$");
  principal: string;
  region: string;
  awsAccountId: string;
  apiId: string;
  stage: string;
  context?: Record<string, string | number | boolean>;
  usageIdentifierKey?: string;
  private allowedRoutes: Array<AwsRoute>;
  private deniedRoutes: Array<AwsRoute>;

  /**
   * @param {string} principal  The principal used for the policy, this should be a unique identifier for the end user
   * @param {string} region AWS Regions. Beware of using '*' since it will not simply mean any region, because stars will greedily
            expand over '/' or other separators.
            See https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_resource.html for more
            details.
   * @param {string} awsAccountId The AWS account id the policy will be generated for. This is used to create the method ARNs.
   * @param {string} apiId The API Gateway API id to be used in the policy.
            Beware of using '*' since it will not simply mean any API Gateway API id, because stars will greedily
            expand over '/' or other separators.
            See https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_resource.html for more
            details.
   * @param {string}  stage The default stage to be used in the policy.
            Beware of using '*' since it will not simply mean any stage, because stars will
            greedily expand over '/' or other separators.
            See https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_resource.html for more
            details.
   * @param {Record<string, string | number | boolean>} [context] Note: only names of type string and values of type int, string or boolean are supported
   * @param {string} [usageIdentifierKey] If the API uses a usage plan (the apiKeySource is set to `AUTHORIZER`), the Lambda authorizer function
            must return one of the usage plan's API keys as the usageIdentifierKey property value.
   */
  constructor(
    principal: string,
    region: string,
    awsAccountId: string,
    apiId: string,
    stage: string,
    context?: Record<string, string | number | boolean>,
    usageIdentifierKey?: string
  ) {
    this.principal = principal;
    this.region = region;
    this.awsAccountId = awsAccountId;
    this.apiId = apiId;
    this.stage = stage;
    this.context = context;
    this.usageIdentifierKey = usageIdentifierKey;
    this.allowedRoutes = [];
    this.deniedRoutes = [];
  }

  private static getEmptyStatement(effect: "Allow" | "Deny"): AwsStatement {
    return {
      Action: "execute-api:Invoke",
      Effect: effect,
      Resource: [],
    };
  }

  private getStatementForEffect(
    effect: "Allow" | "Deny",
    routes: Array<AwsRoute>
  ): Array<AwsStatement> {
    const statements: Array<AwsStatement> = [];
    const statement: AwsStatement =
      AuthorizerResponse.getEmptyStatement(effect);
    routes.forEach(route => {
      if (route.conditions && route.conditions.length > 0) {
        const conditionalStatement =
          AuthorizerResponse.getEmptyStatement(effect);
        conditionalStatement.Resource.push(route.resourceArn);
        conditionalStatement["Condition"] = route.conditions;
        statements.push(conditionalStatement);
      } else {
        statement.Resource.push(route.resourceArn);
      }
    });
    if (statement.Resource.length > 0) {
      statements.push(statement);
    }
    return statements;
  }

  private addRoute(
    effect: "Allow" | "Deny",
    method: HttpVerbsEnum,
    path: string,
    conditions?: Array<AwsPolicyCondition>
  ): void {
    if (!this.pathRegex.test(path)) {
      throw new Error("Invalid Path name");
    }
    if (effect === "Allow") {
      this.allowedRoutes.push({
        resourceArn: buildRouteArn(
          this.region,
          this.awsAccountId,
          this.apiId,
          this.stage,
          method,
          path
        ),
        conditions,
      });
    } else {
      this.deniedRoutes.push({
        resourceArn: buildRouteArn(
          this.region,
          this.awsAccountId,
          this.apiId,
          this.stage,
          method,
          path
        ),
        conditions,
      });
    }
  }

  /**
   * Used to generate policy that will allow all routes for this user
   * Adds a '*' allow to the policy to authorize access to all methods of an API
   */
  allowAllRoutes(): void {
    this.addRoute("Allow", HttpVerbsEnum.ALL, "*");
  }

  /**
   * Used to generate a policy that will deny all routes to this user
   * Adds a '*' deny to the policy to deny access to all methods of an API
   */
  denyAllRoutes(): void {
    this.addRoute("Allow", HttpVerbsEnum.ALL, "*");
  }

  /**
   * Adds an API Gateway method (Http verb + Resource path) to the list of allowed methods for the policy.
   * @param method The method type of this route
   * @param path The resource path of this route
   */
  allowRoute(
    method: HttpVerbsEnum,
    path: string,
    conditions: Array<AwsPolicyCondition>
  ): void {
    this.addRoute("Allow", method, path, conditions);
  }

  /**
   * Adds an API Gateway method (Http verb + Resource path) to the list of denied methods for the policy.
   * @param method The method type of this route
   * @param path The resource path of this route
   */
  denyRoute(
    method: HttpVerbsEnum,
    path: string,
    conditions: Array<AwsPolicyCondition>
  ): void {
    this.addRoute("Deny", method, path, conditions);
  }

  /**
   * Generates the policy document based on the internal lists of allowed and denied conditions.
   * This will generate a policy with two main statements for the effect:
   *  - one statement for Allow and one statement for Deny.
   *  - Methods that includes conditions will have their own statement in the policy.
   */
  getPolicy(): AwsPolicy {
    if (this.allowedRoutes.length === 0 && this.deniedRoutes.length === 0) {
      throw new Error(
        "No statements can be defined since no routes were allowed or denied"
      );
    }
    const policy: AwsPolicy = {
      principalId: this.principal,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          ...this.getStatementForEffect("Allow", this.allowedRoutes),
          ...this.getStatementForEffect("Deny", this.deniedRoutes),
        ],
      },
    };
    if (this.usageIdentifierKey) {
      policy["usageIdentifierKey"] = this.usageIdentifierKey;
    }
    if (this.context) {
      policy["context"] = this.context;
    }
    return policy;
  }
}
