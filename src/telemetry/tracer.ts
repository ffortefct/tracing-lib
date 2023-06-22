import * as otel from "@opentelemetry/api";
import { 
    Resource,
} from "@opentelemetry/resources";
import { 
    SemanticResourceAttributes,
} from "@opentelemetry/semantic-conventions";
import {
    BatchSpanProcessor, 
} from "@opentelemetry/sdk-trace-base";
import {
    NodeTracerProvider,
} from "@opentelemetry/sdk-trace-node";
import { 
    OTLPTraceExporter,
} from "@opentelemetry/exporter-trace-otlp-http";
import { 
    AsyncHooksContextManager, 
} from "@opentelemetry/context-async-hooks";

import {
    Options
} from "./options";

import {
    ModularSpan,
} from "./span"; 

import {
    TracerProviderError,
    UninitializedTracerProviderError,
} from "./errors";

/**
 * Represents a wrapper of [@opentelemetry/api.Tracer](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api.Tracer.html). 
 */
class ModularTracer {
    private tracer: otel.Tracer;

    private static traceProvider: NodeTracerProvider;
    private static instances: Map<string, ModularTracer>;

    /**
     * Initializes the tracer provider and its OTEL exporter. 
     *
     * @param moduleName - tracer name.
     * @param host - `<host>:<port>` of the OTEL collector.
     *
     * @throws {@link TracerProviderError} if it's already defined.
     *
     * @remarks
     * This doesn't validade the host yet, simply assumes it's correct...
     * By default it uses http://localhost:4318/v1/traces.
     */
    public static setup(moduleName: string, host?: string): void {
        if (ModularTracer.traceProvider !== undefined) {
            throw new TracerProviderError();
        }

        // Set the global context manager.
        const ctxManager = new AsyncHooksContextManager();
        ctxManager.enable();
        otel.context.setGlobalContextManager(ctxManager);
        
        // Set resource information.
        const resource = Resource.default().merge(
            new Resource({
                [SemanticResourceAttributes.SERVICE_NAME]: moduleName,
            })
        );

        // Setup exporter and create the processor with it.
        const tracerExporter = new OTLPTraceExporter({
            url: (host !== undefined) ? 
                `http://${host}/v1/traces`
                : 
                "http://localhost:4318/v1/traces",
        });
        const processor = new BatchSpanProcessor(tracerExporter);
        
        // Setup tracer provider.
        const tracerProvider = new NodeTracerProvider({resource: resource});
        tracerProvider.addSpanProcessor(processor);
        tracerProvider.register();
        
        ModularTracer.traceProvider = tracerProvider;
        ModularTracer.instances = new Map();
    }

    /**
     * Creates a new tracer if there isn't one with the same name.
     *
     * @param name - tracer name.
     * @param storage - context storage.
     * @returns a ModularTracer.
     *
     * @throws {@link UninitializedTracerProviderError} if {@link setup} wasn't called yet.
     */
    public static get(name: string): ModularTracer {
        if (ModularTracer.traceProvider === undefined) {
            throw new UninitializedTracerProviderError();
        }

        const instances = ModularTracer.instances;
        
        const tracer = instances.get(name);
        if (tracer !== undefined) {
            return tracer;
        }

        const newTracer = new ModularTracer(name);
        instances.set(name, newTracer);
        return newTracer;
    }

    private constructor(name: string) {
        this.tracer = otel.trace.getTracer(name);
    }

    /**
     * Records an error in a given span and sets the error status.
     */
    private recordException(span: otel.Span, e: any): void {
        span.recordException(e);
        span.setStatus({ 
            // Labels this span with the error status.
            code: otel.SpanStatusCode.ERROR,
        });
    }

    /**
     * Creates a new span associated with its parent.
     *
     * @remarks
     * Returns an independent span if there isn't a parent in the current context.
     */
    private createSpan(
        name: string, 
        fn: (span: otel.Span) => Promise<any>,
        opts?: otel.SpanOptions,
        ctx?: otel.Context,
    ): Promise<any> {
        return otel.context.with(
            ctx || otel.context.active(), (): Promise<any> =>
                this.tracer.startActiveSpan(name, opts || {}, fn)
        );
    }
    
    /**
     * Creates a new span and calls fn inside it.
     *
     * @param name - span identifier.
     * @param fn - function tied to the span.
     * @param [options={}]  - additional parameters to attach at span creation.
     * @param [endSpan=true] - tells if the span should be ended internaly or not.
     * @param [rethrow=true]  - indicates if the catched exception should be rethrow or not.
     *
     * @return the result of fn.
     * 
     * @remarks
     * You don't need to explicitly end the span, this function does it for you.
     * If startSpan was called inside a context without a parent span associated to this tracer, it creates a new indepentent span.
     * If this {@link startAsyncSpan} isn't called inside an active span, it creates an indepentent one.
     */
    public async startAsyncSpan(
        name: string, 
        fn: (ms: ModularSpan) => Promise<any>,
        options: Options = {},
        endSpan: boolean = true,
        rethrow: boolean = true,
    ): Promise<any> {
        let error: Error | undefined;

        let ret = await this.createSpan(
            name, async (s: otel.Span): Promise<any> => {
                const ms = new ModularSpan(s);

                try {
                    return await fn(ms);
                } catch(e: any) {
                    this.recordException(s, error = e);
                } finally {
                    if (endSpan)
                        s.end();
                }
            }, options.opts, options.ctx
        );

        if (error !== undefined && rethrow)
            throw(error);

        return ret;
    } 

    /**
     * Returns the current active context.
     */
    public currentContext(): otel.Context {
        return otel.context.active();
    }

    /**
     * Converts the current active context to an JSON object.
     */
    public marshallContext(): string {
        const ctxObj = {};

        otel.propagation.inject(this.currentContext(), ctxObj);

        return JSON.stringify(ctxObj);
    }
    
    /**
     * Tries to parse the JSON object and extracts the context, associating to the current one.
     */
    public unmarshallContext(rawCtx: string): otel.Context {
        const ctxObj = JSON.parse(rawCtx);

        return otel.propagation.extract(this.currentContext(), ctxObj);
    }
}

export {
    ModularTracer,
}

