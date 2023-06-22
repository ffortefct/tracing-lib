[@ffortefct/tracing-lib](../README.md) / [Exports](../modules.md) / UninitializedTracerProviderError

# Class: UninitializedTracerProviderError

This error is thrown when you try to create a tracer 
without having the tracer provider initialized.

## Hierarchy

- `Error`

  ↳ **`UninitializedTracerProviderError`**

## Table of contents

### Constructors

- [constructor](UninitializedTracerProviderError.md#constructor)

### Properties

- [message](UninitializedTracerProviderError.md#message)
- [name](UninitializedTracerProviderError.md#name)
- [stack](UninitializedTracerProviderError.md#stack)
- [prepareStackTrace](UninitializedTracerProviderError.md#preparestacktrace)
- [stackTraceLimit](UninitializedTracerProviderError.md#stacktracelimit)

### Methods

- [captureStackTrace](UninitializedTracerProviderError.md#capturestacktrace)

## Constructors

### constructor

• **new UninitializedTracerProviderError**()

#### Overrides

Error.constructor

#### Defined in

src/telemetry/errors.ts:17

## Properties

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1068

___

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1067

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1069

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

**`See`**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

#### Inherited from

Error.prepareStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/@types/node/globals.d.ts:13

## Methods

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:4
