[tracing-lib](../README.md) / [Exports](../modules.md) / ModularSpan

# Class: ModularSpan

Represents a wrapper of [@opentelemetry/api.Span](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api.Span.html).

**`Remarks`**

The main purpose is to implicitly finalize the span.

## Table of contents

### Constructors

- [constructor](ModularSpan.md#constructor)

### Properties

- [ended](ModularSpan.md#ended)
- [span](ModularSpan.md#span)

### Methods

- [end](ModularSpan.md#end)
- [recordException](ModularSpan.md#recordexception)
- [setAttribute](ModularSpan.md#setattribute)
- [setAttributes](ModularSpan.md#setattributes)
- [setStatus](ModularSpan.md#setstatus)

## Constructors

### constructor

• **new ModularSpan**(`span`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `span` | `Span` |

#### Defined in

src/telemetry/span.ts:13

## Properties

### ended

• `Private` **ended**: `boolean` = `false`

#### Defined in

src/telemetry/span.ts:11

___

### span

• `Private` **span**: `Span`

#### Defined in

src/telemetry/span.ts:10

## Methods

### end

▸ **end**(`endTime?`): `void`

See [@opentelemetry/api.Span.end](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api.Span.html#end).

**`Remarks`**

This function does nothing on further calls.

#### Parameters

| Name | Type |
| :------ | :------ |
| `endTime?` | `TimeInput` |

#### Returns

`void`

#### Defined in

src/telemetry/span.ts:60

___

### recordException

▸ **recordException**(`exception`, `time?`): `void`

See [@opentelemetry/api.Span.recordException](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api.Span.html#recordException).

#### Parameters

| Name | Type |
| :------ | :------ |
| `exception` | `Exception` |
| `time?` | `TimeInput` |

#### Returns

`void`

#### Defined in

src/telemetry/span.ts:27

___

### setAttribute

▸ **setAttribute**(`k`, `v`): `void`

See [@opentelemetry/api.Span.setAttribute](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api.Span.html#setAttribute).

**`Remarks`**

Semantic conventions on attributes are important to describe operations on a given span. Take a look [here](https://opentelemetry.io/docs/specs/otel/trace/semantic_conventions/). The [@opentelemetry/semantic-conventions.SemanticAttributes](https://open-telemetry.github.io/opentelemetry-js/modules/_opentelemetry_semantic_conventions.html#SemanticAttributes) constant contains those names. See a little example explained [here](https://opentelemetry.io/docs/instrumentation/js/manual/#semantic-attributes).

#### Parameters

| Name | Type |
| :------ | :------ |
| `k` | `string` |
| `v` | `AttributeValue` |

#### Returns

`void`

#### Defined in

src/telemetry/span.ts:40

___

### setAttributes

▸ **setAttributes**(`vs`): `void`

See [@opentelemetry/api.Span.setAttributes](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api.Span.html#setAttributes).

**`Remarks`**

Semantic conventions on attributes are important to describe operations on a given span. Take a look [here](https://opentelemetry.io/docs/specs/otel/trace/semantic_conventions/). The [@opentelemetry/semantic-conventions.SemanticAttributes](https://open-telemetry.github.io/opentelemetry-js/modules/_opentelemetry_semantic_conventions.html#SemanticAttributes) constant contains those names. See a little example explained [here](https://opentelemetry.io/docs/instrumentation/js/manual/#semantic-attributes).

#### Parameters

| Name | Type |
| :------ | :------ |
| `vs` | `Attributes` |

#### Returns

`void`

#### Defined in

src/telemetry/span.ts:50

___

### setStatus

▸ **setStatus**(`status`): `void`

See [@opentelemetry/api.Span.setStatus](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api.Span.html#setStatus).

#### Parameters

| Name | Type |
| :------ | :------ |
| `status` | `SpanStatus` |

#### Returns

`void`

#### Defined in

src/telemetry/span.ts:20
