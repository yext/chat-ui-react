import "@testing-library/jest-dom";
import { mswServer } from "./mswserver";
import { TextDecoder, TextEncoder } from "util";

/**
 * jest's jsdom doesn't have the following properties defined in global for the DOM.
 * polyfill it with custom functions or builtins from NodeJS.
 */

// These are required for Chat Core.
global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;

// eslint-disable-next-line @typescript-eslint/no-empty-function
global.HTMLElement.prototype.scrollIntoView = function() {};

beforeAll(() => mswServer.listen());
afterEach(() => mswServer.resetHandlers());
afterAll(() => mswServer.close());
