# Lambda Authorizer Utils

> Collection of utility functions / helpers to allow using Lambda Authorizer easier

## Install

```bash
npm install @distinction-dev/lambda-authorizer-utils
```

or

```bash
yarn add @distinction-dev/lambda-authorizer-utils
```

## Usage

```ts
import { AuthorizerResponse } from '@distinction-dev/lambda-authorizer-utils';

export const authorizer = (event: APIGatewayRequestAuthorizerEvent) => {
    const response = new AuthorizerResponse(
        "apigateway.amazonaws.com",
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
