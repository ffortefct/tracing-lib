[@ffortefct/tracing-lib](../README.md) / [Exports](../modules.md) / ModularTracer

# Class: ModularTracer

Represents a wrapper of [@opentelemetry/api.Tracer](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api.Tracer.html).

## Table of contents

### Methods

- [currentContext](ModularTracer.md#currentcontext)
- [marshallContext](ModularTracer.md#marshallcontext)
- [startAsyncSpan](ModularTracer.md#startasyncspan)
- [unmarshallContext](ModularTracer.md#unmarshallcontext)
- [get](ModularTracer.md#get)
- [setup](ModularTracer.md#setup)

## Methods

### currentContext

▸ **currentContext**(): `Context`

Returns the current active context.

#### Returns

`Context`

#### Defined in

src/telemetry/tracer.ts:197

___

### marshallContext

▸ **marshallContext**(): `string`

Converts the current active context to an JSON object.

#### Returns

`string`

#### Defined in

src/telemetry/tracer.ts:204

___

### startAsyncSpan

▸ **startAsyncSpan**(`name`, `fn`, `options?`, `endSpan?`, `rethrow?`): `Promise`<`any`\>

Creates a new span and calls fn inside it.

**`Remarks`**

You don't need to explicitly end the span, this function does it for you.
If [startAsyncSpan](ModularTracer.md#startasyncspan) isn't called inside an active span (without options.ctx set), it creates an indepentent one.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `name` | `string` | `undefined` | span identifier. |
| `fn` | (`ms`: [`ModularSpan`](ModularSpan.md)) => `Promise`<`any`\> | `undefined` | function tied to the span. |
| `options?` | [`Options`](../interfaces/Options.md) | `{}` | additional parameters to attach at span creation. |
| `endSpan?` | `boolean` | `true` | tells if the span should be ended internaly or not. |
| `rethrow?` | `boolean` | `true` | indicates if the catched exception should be rethrow or not. |

#### Returns

`Promise`<`any`\>

the result of fn.

#### Defined in

src/telemetry/tracer.ts:164

___

### unmarshallContext

▸ **unmarshallContext**(`rawCtx`): `Context`

Tries to parse the JSON object and extracts the context, associating to the current one.

#### Parameters

| Name | Type |
| :------ | :------ |
| `rawCtx` | `string` |

#### Returns

`Context`

#### Defined in

src/telemetry/tracer.ts:215

___

### get

▸ `Static` **get**(`name`): [`ModularTracer`](ModularTracer.md)

Creates a new tracer if there isn't one with the same name.

**`Throws`**

[UninitializedTracerProviderError](UninitializedTracerProviderError.md) if [setup](ModularTracer.md#setup) wasn't called yet.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | tracer name. |

#### Returns

[`ModularTracer`](ModularTracer.md)

a ModularTracer.

#### Defined in

src/telemetry/tracer.ts:99

___

### setup

▸ `Static` **setup**(`moduleName`, `host?`): `void`

Initializes the tracer provider and its OTEL exporter.

**`Throws`**

[TracerProviderError](TracerProviderError.md) if it's already defined.

**`Remarks`**

This doesn't validade the host yet, simply assumes it's correct...
By default it uses http://localhost:4318/v1/traces.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `moduleName` | `string` | tracer name. |
| `host?` | `string` | `<host>:<port>` of the OTEL collector. |

#### Returns

`void`

#### Defined in

src/telemetry/tracer.ts:55
