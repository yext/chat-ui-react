import { RequestHandler, rest } from "msw";
import { setupServer } from "msw/node";
import { chatresponse } from "./response";
/**
 * Mock Chat Core by intercepting Chat API requests on network level using Mock Service Worker (MSW).
 * This ensures unit tests doesn't send actual requests to Chat API. Any unhandled requests are dropped
 * and logged as warnings.
 */
export const mswHandlers: RequestHandler[] = [
  rest.post(/chat\/.*\/message$/, (_req, res, ctx) => {
    return res(ctx.json(chatresponse));
  }),
  rest.post(/chat\/.*\/message\/streaming$/, (_req, res, ctx) => {
    return res(ctx.json(chatresponse));
  }),
];

export const mswServer = setupServer(...mswHandlers);
