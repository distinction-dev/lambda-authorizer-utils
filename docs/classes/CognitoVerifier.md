# CognitoVerifier

## Properties

- [keysUrl](#keysurl)
- [publicKeys](#publickeys)
- [region](#region)
- [userPoolId](#userpoolid)

## Methods

- [fetchKeys](#fetchkeys)
- [getPublicKeys](#getpublickeys)
- [verify](#verify)

### Constructor

• **new CognitoVerifier**(`params`)

#### Parameters

| Name | Type | Description
| :------ | :------ | :------ |
| `region` | `string` |
| `userPoolId` | `string` |

#### Defined in

[cognito.ts:37](https://github.com/distinction-dev/lambda-authorizer-utils/blob/3d085bb/src/cognito.ts#L37)

## Properties

### keysUrl

• `Private` **keysUrl**: `string`

The url where the public key for the Cognito User Pool can be found
This is supposed to be a getter

#### Defined in

[cognito.ts:35](https://github.com/distinction-dev/lambda-authorizer-utils/blob/3d085bb/src/cognito.ts#L35)

___

### publicKeys

• `Private` **publicKeys**: ``null`` \| [`PublicKey`](interfaces/PublicKey.md)[] = `null`

#### Defined in

[cognito.ts:30](https://github.com/distinction-dev/lambda-authorizer-utils/blob/3d085bb/src/cognito.ts#L30)

___

### region

• `Private` **region**: `string`

#### Defined in

[cognito.ts:29](https://github.com/distinction-dev/lambda-authorizer-utils/blob/3d085bb/src/cognito.ts#L29)

___

### userPoolId

• `Private` **userPoolId**: `string`

#### Defined in

[cognito.ts:28](https://github.com/distinction-dev/lambda-authorizer-utils/blob/3d085bb/src/cognito.ts#L28)

## Methods

### fetchKeys

▸ `Private` **fetchKeys**(): `Promise`<[`PublicKey`](interfaces/PublicKey.md)[]\>

#### Returns

`Promise`<[`PublicKey`](interfaces/PublicKey.md)[]\>

#### Defined in

[cognito.ts:52](https://github.com/distinction-dev/lambda-authorizer-utils/blob/3d085bb/src/cognito.ts#L52)

___

### getPublicKeys

▸ `Private` **getPublicKeys**(): `Promise`<[`PublicKey`](interfaces/PublicKey.md)[]\>

#### Returns

`Promise`<[`PublicKey`](interfaces/PublicKey.md)[]\>

#### Defined in

[cognito.ts:45](https://github.com/distinction-dev/lambda-authorizer-utils/blob/3d085bb/src/cognito.ts#L45)

___

### verify

▸ **verify**(`token`): `Promise`<`boolean`\>

Use this function to verify the Cognito token

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[cognito.ts:63](https://github.com/distinction-dev/lambda-authorizer-utils/blob/3d085bb/src/cognito.ts#L63)
