# AzureVerifier

## Properties

- [keysUrl](#keysurl)
- [publicKeys](#publickeys)
- [tenantId](#tenantid)

## Methods

- [fetchKeys](#fetchkeys)
- [getPublicKeys](#getpublickeys)
- [verify](#verify)

### Constructor

• **new AzureVerifier**(`params`)

#### Parameters

| Name       | Type     | Description |
| :--------- | :------- | :---------- |
| `tenantId` | `string` |             |

#### Defined in

[Azure.ts:37](https://github.com/distinction-dev/lambda-authorizer-utils/blob/3d085bb/src/azure.ts#L37)

## Properties

### keysUrl

• `Private` **keysUrl**: `string`

The url where the public key for the Azure User Pool can be found
This is supposed to be a getter

#### Defined in

[jwt.ts:28](https://github.com/distinction-dev/lambda-authorizer-utils/blob/3d085bb/src/jwt.ts#L28)

---

### publicKeys

• `Private` **publicKeys**: `null` \| [`PublicKey`](interfaces/PublicKey.md)[] = `null`

#### Defined in

[jwt.ts:23](https://github.com/distinction-dev/lambda-authorizer-utils/blob/3d085bb/src/jwt.ts#L23)

---

### tenantId

• `Private` **tenantId**: `string`

#### Defined in

[Azure.ts:13](https://github.com/distinction-dev/lambda-authorizer-utils/blob/3d085bb/src/azure.ts#L13)

## Methods

### fetchKeys

▸ `Private` **fetchKeys**(): `Promise`<[`PublicKey`](interfaces/PublicKey.md)[]\>

#### Returns

`Promise`<[`PublicKey`](interfaces/PublicKey.md)[]\>

#### Defined in

[jwt.ts:84](https://github.com/distinction-dev/lambda-authorizer-utils/blob/3d085bb/src/jwt.ts#L84)

---

### getPublicKeys

▸ `Private` **getPublicKeys**(): `Promise`<[`PublicKey`](interfaces/PublicKey.md)[]\>

#### Returns

`Promise`<[`PublicKey`](interfaces/PublicKey.md)[]\>

#### Defined in

[jwt.ts:74](https://github.com/distinction-dev/lambda-authorizer-utils/blob/3d085bb/src/jwt.ts#L74)

---

### verify

▸ **verify**(`token`): `Promise`<`boolean`\>

Use this function to verify the Azure token

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `token` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[Azure.ts:27](https://github.com/distinction-dev/lambda-authorizer-utils/blob/3d085bb/src/azure.ts#L27)
