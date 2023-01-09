# AuthorizerResponse

Based on:-

- <https://github.com/awslabs/aws-apigateway-lambda-authorizer-blueprints/blob/master/blueprints/nodejs/index.js>

Documentation:-

- <https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-lambda-authorizer.html>
- <https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-output.html>

## Constructor

• **new AuthorizerResponse**(`principal`, `region`, `awsAccountId`, `apiId`, `stage`, `context?`, `usageIdentifierKey?`)

### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `principal` | `string` | The principal used for the policy, this should be a unique identifier for the end user |
| `region` | `string` | AWS Regions. Beware of using '*' since it will not simply mean any region, because stars will greedily expand over '/' or other separators. See <https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_resource.html> for more details. |
| `awsAccountId` | `string` | The AWS account id the policy will be generated for. This is used to create the method ARNs. |
| `apiId` | `string` | The API Gateway API id to be used in the policy. Beware of using '*' since it will not simply mean any API Gateway API id, because stars will greedily expand over '/' or other separators. See <https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_resource.html> for more details. |
| `stage` | `string` | The default stage to be used in the policy. Beware of using '*' since it will not simply mean any stage, because stars will greedily expand over '/' or other separators. See <https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_resource.html> for more details. |
| `context?` | `Record`<`string`, `string` \| `number` \| `boolean`\> | Note: only names of type string and values of type int, string or boolean are supported |
| `usageIdentifierKey?` | `string` | If the API uses a usage plan (the apiKeySource is set to `AUTHORIZER`), the Lambda authorizer function must return one of the usage plan's API keys as the usageIdentifierKey property value. |

## Properties

### allowedRoutes

• `Private` **allowedRoutes**: [`AwsRoute`](../modules.md#awsroute)[]
___

### apiId

• **apiId**: `string`
___

### awsAccountId

• **awsAccountId**: `string`
___

### context

• `Optional` **context**: `Record`<`string`, `string` \| `number` \| `boolean`\>
___

### deniedRoutes

• `Private` **deniedRoutes**: [`AwsRoute`](../modules.md#awsroute)[]
___

### pathRegex

• `Private` `Readonly` **pathRegex**: `RegExp`

The regular expression used to validate resource paths for the policy
___

### principal

• **principal**: `string`
___

### region

• **region**: `string`
___

### stage

• **stage**: `string`
___

### usageIdentifierKey

• `Optional` **usageIdentifierKey**: `string`

## Methods

### allowAllRoutes

▸ **allowAllRoutes**(): `void`

Used to generate policy that will allow all routes for this user
Adds a '*' allow to the policy to authorize access to all methods of an API
___

### allowRoute

▸ **allowRoute**(`method`, `path`, `conditions`): `void`

Adds an API Gateway method (Http verb + Resource path) to the list of allowed methods for the policy.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | [`HttpVerbsEnum`](../enums/HttpVerbsEnum.md) | The method type of this route |
| `path` | `string` | The resource path of this route |
| `conditions` | [`AwsPolicyCondition`](../modules.md#awspolicycondition)[] | - |
___

### denyAllRoutes

▸ **denyAllRoutes**(): `void`

Used to generate a policy that will deny all routes to this user
Adds a '*' deny to the policy to deny access to all methods of an API
___

### denyRoute

▸ **denyRoute**(`method`, `path`, `conditions`): `void`

Adds an API Gateway method (Http verb + Resource path) to the list of denied methods for the policy.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | [`HttpVerbsEnum`](../enums/HttpVerbsEnum.md) | The method type of this route |
| `path` | `string` | The resource path of this route |
| `conditions` | [`AwsPolicyCondition`](../modules.md#awspolicycondition)[] | - |
___

### getPolicy

▸ **getPolicy**(): [`AwsPolicy`](../modules.md#awspolicy)

Generates the policy document based on the internal lists of allowed and denied conditions.
This will generate a policy with two main statements for the effect:

- One statement for Allow and One statement for Deny.
- Methods that includes conditions will have their own statement in the policy.

___
