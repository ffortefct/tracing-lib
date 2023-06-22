import express, { NextFunction } from "express";
import {
    IncomingHttpHeaders, 
    OutgoingHttpHeaders,
} from "http";
import { 
    SemanticAttributes, 
} from "@opentelemetry/semantic-conventions";

import {
  ModularTracer,
  ModularSpan,
} from "@ffortefct/tracing-lib";

// < ------ helpers ------ >

function fetchHeaders(
  headers: IncomingHttpHeaders | OutgoingHttpHeaders,
): string {
  return JSON.stringify(headers);
}

function fetchRequestBody(req: express.Request): string {
  return JSON.stringify(req.body);
}

function parseResponseBody(body: any): string {
  if (Buffer.isBuffer(body)) {
    return (body as Buffer).toString("utf8");
  }
 
  if (typeof body === "string") {
    return body;
  }

  return JSON.stringify(body);
}

// < ------ middleware spoofer ------ >

async function extractMessage(
  req: express.Request, 
  res: express.Response,
  next: express.NextFunction,
  span: ModularSpan,
): Promise<void> {
  // Register request info.
  span.setAttributes({
    [SemanticAttributes.HTTP_HOST]: req.hostname,
    [SemanticAttributes.HTTP_METHOD]: req.method,
    [SemanticAttributes.HTTP_URL]: req.url,
    "http.request.headers": fetchHeaders(req.headers),
    "http.request.body": fetchRequestBody(req),
  });

  const originalSend = res.send;
  res.send = (body: any): any => {
    // Register response info.
    span.setAttributes({
      [SemanticAttributes.HTTP_STATUS_CODE]: res.statusCode,
      "http.response.headers": fetchHeaders(res.getHeaders()),
      "http.response.body": parseResponseBody(body),
    });

    res.send = originalSend;
    return res.send(body);
  };

  next();
}

// < ------ span producers ------ >

async function foo1(): Promise<void> {
  await tracer.startAsyncSpan(
    "foo1", async (ms: ModularSpan): Promise<void> => {
      ms.setAttributes({integer: 1, float: 2.});
  });
}

async function foo2(): Promise<void> {
  try {
    await tracer.startAsyncSpan(
      "foo2", async (_: ModularSpan): Promise<void> => {
        throw Error("this is a error test");
    }, {opts: {attributes: {"throws.error": "some error"}}});
  } catch (e: any) {
    await tracer.startAsyncSpan(
      "foo2-catch", async (ms: ModularSpan): Promise<void> => {
        ms.setAttribute("error.from.foo2", "some error");
    });
  }
}

async function foo3(): Promise<void> {
  await tracer.startAsyncSpan(
    "foo3", async (_: ModularSpan): Promise<void> => {
      await foo1();
      await foo2();
  });
}

async function foo4(): Promise<void> {
  await tracer.startAsyncSpan(
    "foo4", async (_: ModularSpan): Promise<void> => {
      await foo1();
      await foo3();
  });
}

// < ------ tracer initialization ------ >

ModularTracer.setup("demo");
const tracer = ModularTracer.get("tracer-demo"); 

// < ------ app initialization ------ >

const app = express();
const router = express.Router();
const port = 4000;

// < ------ app middleware ------ >

async function middleware(
  req: express.Request,
  res: express.Response,
  next: NextFunction
): Promise<void> {
  tracer.startAsyncSpan(
    `middleware-spoofer: endpoint ${req.path}`, 
    async (ms: ModularSpan): Promise<void> => await extractMessage(req, res, next, ms));
}

app.use(middleware);

// < ------ app handlers ------ >

router.get("/e1", async (
  _: express.Request,
  res: express.Response): Promise<void> => {
    await tracer.startAsyncSpan(
      "e1", async (_: ModularSpan): Promise<void> => {
        await foo1();
    });
    res.sendStatus(200);
});

router.get("/e2", async (
  _: express.Request,
  res: express.Response): Promise<void> => {
    await tracer.startAsyncSpan(
      "e2", async (_: ModularSpan): Promise<void> => {
      await foo3();
    });
    res.sendStatus(201);
});

router.get("/e3", async (
  _: express.Request,
  res: express.Response): Promise<void> => {
    await tracer.startAsyncSpan(
      "e3", async (_: ModularSpan): Promise<void> => {
      await foo4();
    });
    res.sendStatus(404);
});

app.use("/", router);

// < ------ app launch ------ >
//
app.listen(port, () => console.log(`Listening to port ${port}`))

