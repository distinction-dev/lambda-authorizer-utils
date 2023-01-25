# Lambda Authorizer Utils

> Collection of utility functions / helpers to help with building Api Gateway Lambda Authorizer easier with Typescript

## Install

```bash
yarn add @distinction-dev/lambda-authorizer-utils
```

## Modules

- Verifiers
  - [Cognito](./classes/CognitoVerifier)
  - [WS02](./classes/)

- Utils
  - [AuthResponse](./classes/AuthorizerResponse.md)

## Usage

```ts
import { AuthorizerResponse } from '@distinction-dev/lambda-authorizer-utils';

export const authorizer = (event: APIGatewayRequestAuthorizerEvent) => {
    const response = new AuthorizerResponse(
        "<principal_id>",
        "<aws_region>",
        "<aws_account_id>",
        "<api_id>",
        "<api_stage>"
    )
    response.addRoute("GET", "/test")
    return response.getPolicy()
}

```

## Docs

Full docs [here](https://distinction-dev.github.io/lambda-authorizer-utils)
