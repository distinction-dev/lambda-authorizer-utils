[@distinction-dev/lambda-authorizer-utils](README.md) / Exports

# @distinction-dev/lambda-authorizer-utils

## Table of contents

### Enumerations

- [HttpVerbsEnum](enums/HttpVerbsEnum.md)

### Classes

- [AuthorizerResponse](classes/AuthorizerResponse.md)
- [CognitoVerifier](classes/CognitoVerifier.md)

### Interfaces

- [Claims](interfaces/Claims.md)
- [PublicKey](interfaces/PublicKey.md)

### Type Aliases

- [AwsPolicy](modules.md#awspolicy)
- [AwsPolicyCondition](modules.md#awspolicycondition)
- [AwsRoute](modules.md#awsroute)
- [AwsStatement](modules.md#awsstatement)

### Variables

- [DENY\_ALL\_RESPONSE](modules.md#deny_all_response)

### Functions

- [buildRouteArn](modules.md#buildroutearn)

## Type Aliases

### AwsPolicy

Ƭ **AwsPolicy**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `context?` | `Record`<`string`, `string` \| `number` \| `boolean`\> |
| `policyDocument` | { `Statement`: [`AwsStatement`](modules.md#awsstatement)[] ; `Version`: ``"2012-10-17"``  } |
| `policyDocument.Statement` | [`AwsStatement`](modules.md#awsstatement)[] |
| `policyDocument.Version` | ``"2012-10-17"`` |
| `principalId` | `string` |
| `usageIdentifierKey?` | `string` |

#### Defined in

[authorizerResponse.ts:56](https://github.com/distinction-dev/lambda-authorizer-utils/blob/3d085bb/src/authorizerResponse.ts#L56)

___

### AwsPolicyCondition

Ƭ **AwsPolicyCondition**: `Record`<`string`, `Record`<`string`, `string`\>\>

#### Defined in

[authorizerResponse.ts:45](https://github.com/distinction-dev/lambda-authorizer-utils/blob/3d085bb/src/authorizerResponse.ts#L45)

___

### AwsRoute

Ƭ **AwsRoute**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `conditions?` | [`AwsPolicyCondition`](modules.md#awspolicycondition)[] |
| `resourceArn` | `string` |

#### Defined in

[authorizerResponse.ts:46](https://github.com/distinction-dev/lambda-authorizer-utils/blob/3d085bb/src/authorizerResponse.ts#L46)

___

### AwsStatement

Ƭ **AwsStatement**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Action` | `string` |
| `Condition?` | [`AwsPolicyCondition`](modules.md#awspolicycondition)[] |
| `Effect` | ``"Allow"`` \| ``"Deny"`` |
| `Resource` | `string`[] |

#### Defined in

[authorizerResponse.ts:50](https://github.com/distinction-dev/lambda-authorizer-utils/blob/3d085bb/src/authorizerResponse.ts#L50)

## Variables

### DENY\_ALL\_RESPONSE

• `Const` **DENY\_ALL\_RESPONSE**: `Object`

Deny access to the api completely

#### Type declaration

| Name | Type |
| :------ | :------ |
| `policyDocument` | { `Statement`: { `Action`: `string` = "execute-api:Invoke"; `Effect`: `string` = "Deny"; `Resource`: `string`[]  }[] ; `Version`: `string` = "2012-10-17" } |
| `policyDocument.Statement` | { `Action`: `string` = "execute-api:Invoke"; `Effect`: `string` = "Deny"; `Resource`: `string`[]  }[] |
| `policyDocument.Version` | `string` |
| `principalId` | `string` |

#### Defined in

[authorizerResponse.ts:4](https://github.com/distinction-dev/lambda-authorizer-utils/blob/3d085bb/src/authorizerResponse.ts#L4)

## Functions

### buildRouteArn

▸ **buildRouteArn**(`region`, `awsAccountId`, `apiId`, `stage`, `method`, `path`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `region` | `string` |
| `awsAccountId` | `string` |
| `apiId` | `string` |
| `stage` | `string` |
| `method` | `string` |
| `path` | `string` |

#### Returns

`string`

#### Defined in

[authorizerResponse.ts:18](https://github.com/distinction-dev/lambda-authorizer-utils/blob/3d085bb/src/authorizerResponse.ts#L18)
