import {
  AwsHttpLambdaAuthorizer,
  ServerlessFrameworkConfiguration,
} from "serverless-schema";

const authorizerConfig: AwsHttpLambdaAuthorizer = {
  name: "authorizer",
  resultTtlInSeconds: 300,
  type: "request",
};

const configuration: ServerlessFrameworkConfiguration = {
  service: "test-authorizer",
  provider: {
    name: "aws",
    runtime: "nodejs16.x",
    logs: {
      // @ts-ignore
      restApi: {
        format:
          '{ "requestId":"$context.requestId", "ip": "$context.identity.sourceIp", "httpMethod":"$context.httpMethod","resourcePath":"$context.resourcePath", "status":"$context.status", "error": "$context.error" }',
      },
    },
  },
  functions: {
    authorizer: {
      handler: "functions/authorizer.handler",
    },
    hello: {
      handler: "functions/hello.handler",
      events: [
        {
          http: {
            method: "GET",
            path: "/hello",
            authorizer: authorizerConfig,
          },
        },
        {
          http: {
            method: "GET",
            path: "/hello2",
            authorizer: authorizerConfig,
          },
        },
        {
          http: {
            method: "GET",
            path: "/variable/{id}",
          },
        },
      ],
    },
  },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
    },
  },
  plugins: ["serverless-esbuild"],
};

module.exports = configuration;
