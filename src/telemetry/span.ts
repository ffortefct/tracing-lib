import * as otel from "@opentelemetry/api";

/**
 * Represents a wrapper of [@opentelemetry/api.Span](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api.Span.html). 
 *
 * @remarks
 * The main purpose is to implicitly finalize the span.
 */
class ModularSpan {
    private span: otel.Span;
    private ended: boolean = false;

    constructor(span: otel.Span) {
        this.span = span;
    }

    /**
     * See [@opentelemetry/api.Span.setStatus](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api.Span.html#setStatus).
     */
    public setStatus(status: otel.SpanStatus): void {
        this.span = this.span.setStatus(status);
    }

    /**
     * See [@opentelemetry/api.Span.recordException](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api.Span.html#recordException).
     */
    public recordException(
        exception: otel.Exception, 
        time?: otel.TimeInput,
    ): void {
        this.span.recordException(exception, time);
    }

    /**
     * See [@opentelemetry/api.Span.setAttribute](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api.Span.html#setAttribute).
     * 
     * @remarks
     * Semantic conventions on attributes are important to describe operations on a given span. Take a look [here](https://opentelemetry.io/docs/specs/otel/trace/semantic_conventions/). The [@opentelemetry/semantic-conventions.SemanticAttributes](https://open-telemetry.github.io/opentelemetry-js/modules/_opentelemetry_semantic_conventions.html#SemanticAttributes) constant contains those names. See a little example explained [here](https://opentelemetry.io/docs/instrumentation/js/manual/#semantic-attributes).
     */
    public setAttribute(k: string, v: otel.AttributeValue): void {
        this.span.setAttribute(k , v);
    }

    /**
     * See [@opentelemetry/api.Span.setAttributes](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api.Span.html#setAttributes).
     * 
     * @remarks
     * Semantic conventions on attributes are important to describe operations on a given span. Take a look [here](https://opentelemetry.io/docs/specs/otel/trace/semantic_conventions/). The [@opentelemetry/semantic-conventions.SemanticAttributes](https://open-telemetry.github.io/opentelemetry-js/modules/_opentelemetry_semantic_conventions.html#SemanticAttributes) constant contains those names. See a little example explained [here](https://opentelemetry.io/docs/instrumentation/js/manual/#semantic-attributes).
     */
    public setAttributes(vs: otel.Attributes): void {
        this.span.setAttributes(vs);
    }

    /**
     * See [@opentelemetry/api.Span.end](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api.Span.html#end).
     *
     * @remarks
     * This function does nothing on further calls.
     */
    public end(endTime?: otel.TimeInput): void {
        if (this.ended) {
            return;
        }

        this.span.end(endTime);

        this.ended = true;
    }
}

export {
    ModularSpan,
}

