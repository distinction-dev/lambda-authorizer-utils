# Deny all responses

Deny access to the api completely

## Usage

```ts
import { DENY_ALL_RESPONSE } from '@distinction-dev/lambda-authorizer-utils';

export const authorizer = (event: APIGatewayRequestAuthorizerEvent) => {
    return DENY_ALL_RESPONSE
}

```

## Properties

```ts
response = {
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
```
