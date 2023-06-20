import * as otel from "@opentelemetry/api";

/**
 * Additional span initialization options.
 */
interface Options {
    /** Internal options. See [here](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api.SpanOptions.html). */
    opts?: otel.SpanOptions,
    /** Sets the span on the given context. Click [here](https://opentelemetry.io/docs/instrumentation/js/context/) to know more about those contexts. */
    ctx?: otel.Context,
}

export {
    Options
}

