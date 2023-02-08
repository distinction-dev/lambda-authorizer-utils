/**
 * Deny access to the api completely
 */
export const DENY_ALL_RESPONSE: AwsPolicy = {
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

export type ApiGatewayArnParts = {
  region: string;
  awsAccountId: string;
  apiId: string;
  stage: string;
};

/**
 * Enum of Http Verbs
 */
export const HttpVerbsEnum = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  HEAD: "HEAD",
  DELETE: "DELETE",
  OPTIONS: "OPTIONS",
  ALL: "*",
} as const;

export type HttpVerbsEnum = typeof HttpVerbsEnum[keyof typeof HttpVerbsEnum];

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
 * The regular expression used to validate resource paths for the policy
 */
export const PATH_REGEXP =
  /^\/?(?:(?:(?:[\w\-\\*]*)|(?:\{[\w]+\}))\/)*(?:(?:[\w\-\\*]*)|(?:\{[\w]+\}))$/;

/**
 * Based on:- https://github.com/awslabs/aws-apigateway-lambda-authorizer-blueprints/blob/master/blueprints/nodejs/index.js
 * Documentation:-
 * - https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-lambda-authorizer.html
 * - https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-output.html
 */
export class AuthorizerResponse {
  principal: string;
  region: string;
  awsAccountId: string;
  apiId: string;
  stage: string;
  disablePathCheck: boolean;
  context?: Record<string, string | number | boolean>;
  usageIdentifierKey?: string;
  /**
   * An array containing all the routes that a user is allowed for
   */
  private allowedRoutes: Array<AwsRoute>;
  /**
   * An array containing all the routes that a user is denied for
   */
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
    disablePathCheck?: boolean,
    context?: Record<string, string | number | boolean>,
    usageIdentifierKey?: string
  ) {
    this.principal = principal;
    this.region = region;
    this.awsAccountId = awsAccountId;
    this.apiId = apiId;
    this.stage = stage;
    this.disablePathCheck = disablePathCheck || false;
    this.context = context;
    this.usageIdentifierKey = usageIdentifierKey;
    this.allowedRoutes = [];
    this.deniedRoutes = [];
  }
  /**
   * @param arn This is the arn you receive as methodArn in the event,  Example:- arn:aws:execute-api:us-east-1:123456789012:abcdef123/test/GET/request
   */
  public static parseApiGatewayArn(arn: string): ApiGatewayArnParts {
    const arnParts = arn.split(":");
    const apiGatewayParts = arnParts[5].split("/");
    return {
      region: arnParts[3],
      awsAccountId: arnParts[4],
      apiId: apiGatewayParts[0],
      stage: apiGatewayParts[1],
    };
  }

  private static getEmptyStatement(effect: "Allow" | "Deny"): AwsStatement {
    return {
      Action: "execute-api:Invoke",
      Effect: effect,
      Resource: [],
    };
  }

  public static buildRouteArn(
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

    // Match regex with path variables and replace them with "*"
    const regex = /{[a-zA-Z_$]+[a-zA-Z0-9_$]*}/g;
    path = path.replace(regex, "*");
    return `arn:aws:execute-api:${region}:${awsAccountId}:${apiId}/${stage}/${method}/${path}`;
  }

  public static fromMethodArn(
    principalId: string,
    arn: string,
    disablePathCheck?: boolean,
    context?: Record<string, string | number | boolean>,
    usageIdentifierKey?: string
  ): AuthorizerResponse {
    const apiGatewayArnParts = AuthorizerResponse.parseApiGatewayArn(arn);

    return new AuthorizerResponse(
      principalId,
      apiGatewayArnParts.region,
      apiGatewayArnParts.awsAccountId,
      apiGatewayArnParts.apiId,
      apiGatewayArnParts.stage,
      disablePathCheck,
      context,
      usageIdentifierKey
    );
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
    if (!this.disablePathCheck) {
      if (!PATH_REGEXP.test(path)) {
        throw new Error(`Invalid Path name:- ${path}`);
      }
    }
    if (effect === "Allow") {
      this.allowedRoutes.push({
        resourceArn: AuthorizerResponse.buildRouteArn(
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
        resourceArn: AuthorizerResponse.buildRouteArn(
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
    this.addRoute("Deny", HttpVerbsEnum.ALL, "*");
  }

  /**
   * Adds an API Gateway method (Http verb + Resource path) to the list of allowed methods for the policy.
   * @param method The method type of this route
   * @param path The resource path of this route
   */
  allowRoute(
    method: HttpVerbsEnum,
    path: string,
    conditions?: Array<AwsPolicyCondition>
  ): AuthorizerResponse {
    this.addRoute("Allow", method, path, conditions);
    return this;
  }

  /**
   * Adds an API Gateway method (Http verb + Resource path) to the list of denied methods for the policy.
   * @param method The method type of this route
   * @param path The resource path of this route
   */
  denyRoute(
    method: HttpVerbsEnum,
    path: string,
    conditions?: Array<AwsPolicyCondition>
  ): AuthorizerResponse {
    this.addRoute("Deny", method, path, conditions);
    return this;
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
