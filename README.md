### OpenTelemetry Node.js API wrapper

Automates its initialization and abstracts some boilerplate at span creation.
Documentation is [here](https://ffortefct.github.io/tracing-lib/).

### Example

There's a demo in the `examples` folder which use express.

### Traces vs Spans

Simply put, spans are single units of work (e.g., querying a database), while traces are collections of them.

### Context

Every span has an internal context to keep track of its state. This context can be obtained to explicitly correlate spans. See [Propagation](#propagation) section.
For example, imagine that you create the following nested spans (see an example in [Create Spans](#create-spans) section): `s1`, `s2` inside `s1` and `s3` inside `s2`.

The trace tree will have the following format:

```
s1 (span root)
|
s2
|
s3
```

### Installation

```sh
yarn add @ffortefct/tracing-lib
```

### Instrumenting

I'll give you a brief insight on how to instrument your code using this wrapper, since the logic is practically the same as the official API.
Check this step-by-step [guide](https://opentelemetry.io/docs/instrumentation/js/manual/) to know more.

#### Setup

You only need to initialize one type since it has global state.

```typescript
import { ModularTracer } from "@ffortefct/tracing-lib";

const moduleName = "whatever-you-want";
const collector = "otlp-collector:4318";
// You can ommit the collector's address. It uses localhost:4318 by default.
ModularTracer.setup(moduleName, collector);
```

#### Create a tracer 

All created tracers can be used globaly. If you try to get the same tracer more than one time, the method will return the same instance.

```typescript
const tracer: ModularTracer = ModularTracer.get("whatever-you-want");
```

#### Create spans

`startAsyncSpan` contains additional parameters (which are't present in the `startActiveSpan` method from the official API) that you can use to fine tune the span.

If some error is thrown inside a span function, it registers the traceback in the span's log. The exception is rethrown by default (`demo` has an example of it).

```typescript
import { ModularSpan } from "@ffortefct/tracing-lib";
import { Context } from "@opentelemetry/api";

let spanCtx: Context = undefined;

await tracer.startAsyncSpan(
    "root", async (ms: ModularSpan): Promise<void> => {
        // You can specify attributes.
        ms.setAttributes({a: "me", "b.attr": 1234});

        // Spans can be nested (relation between them is done automatically).
        await tracer.startAsyncSpan(
            "nested", async (ms: ModularSpan): Promise<void> => {
                dbInstance.insert({name: "car"});
        }, {opts: {attributes: { "db.insertion": "car"}}}); // attributes that are inserted at span creation.

        // Returns root's context.
        spanCtx = tracer.currentContext();
});

// You can manually correlate spans.
await tracer.startAsyncSpan(
    "manual", async (ms: ModularSpan): Promise<void> => {
        callSomething();
}, {ctx: spanCtx});

/** 
 * This will create the follwing trace tree:
 *
 *      root
 *     /    \
 *    /      \
 * nested   manual
 *
 */
```

Read the [Attribute Specification](https://opentelemetry.io/docs/specs/otel/common/) to see limitations and accepted types.

#### Propagation

There're operations that involve different services (e.g., event consumption). You can use this approach to trace those cases:

`Service 1`

```typescript
ModularTracer.setup("service-1");
const tracer = ModularTracer.get("service-1-tracer");
...
// Calls the ModularTracer.currentContext method 
// and converts the context to a JSON object.
const jsonCtx = tracer.marshallContext();
// It's up to you how to send the context (e.g., event body).
service2.sendCtx(jsonCtx);
```

`Service 2`

```typescript
ModularTracer.setup("service-2");
const tracer = ModularTracer.get("service-2-tracer");
...
const jsonCtx = service1.receiveCtx();
const ctx = tracer.unmarshallContext(jsonCtx);
await tracer.startAsyncSpan(
    "manual", async (ms: ModularSpan): Promise<void> => {
        someOperation();
}, {ctx});
```

