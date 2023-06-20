/**
 * Thrown when the tracer provider is already registered. 
 */
class TracerProviderError extends Error {
    constructor() {
        super(
            "Tracer provider is already initialized."
        );
    }
}

/**
 * This error is thrown when you try to create a tracer 
 * without having the tracer provider initialized.
 */
class UninitializedTracerProviderError extends Error {
    constructor() {
        super(
            "Tracer provider isn't yet defined. \
            Call ModularTracer.setup first"
        );
    }
}

export {
    TracerProviderError,
    UninitializedTracerProviderError, 
}

