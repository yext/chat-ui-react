import type { Preview } from "@storybook/react";
import { initialize, mswLoader } from "msw-storybook-addon";
import "./index.css";
import { rest } from "msw";

// Initialize MSW
initialize({
  onUnhandledRequest: "bypass",
});

const preview: Preview = {
  parameters: {
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
          return res(ctx.json({}));
        }),
        rest.post(/chat\/.+\/message\/streaming/, (_req, res, ctx) => {
          return res(ctx.json({}));
        }),
      ],
    },
  },
  // Provide the MSW addon loader globally
  loaders: [mswLoader],
};

export default preview;
