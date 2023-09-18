import type { Preview } from "@storybook/react";
import { initialize, mswLoader } from "msw-storybook-addon";
import "./index.css";
import { rest } from "msw";
import { chatresponse } from "../tests/__setup__/response";

// Initialize MSW
initialize({
  onUnhandledRequest: "bypass",
});

const preview: Preview = {
  parameters: {
    docs: {
      story: {
        // https://storybook.js.org/docs/react/api/doc-block-story#autoplay
        autoplay: true
      }
    },
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    msw: {
      handlers: [
        rest.post(/chat\/.+\/message/, (_req, res, ctx) => {
          return res(ctx.json(chatresponse));
        }),
        rest.post(/chat\/.+\/message\/streaming/, (_req, res, ctx) => {
          return res(ctx.json(chatresponse));
        }),
        rest.post(/accounts\/me\/events/, (_req, res, ctx) => {
          return res(ctx.json({}));
        }),
      ],
    },
  },
  // Provide the MSW addon loader globally
  loaders: [mswLoader],
};

export default preview;
