import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../tests/**/*.stories.tsx"],
  staticDirs: ["./public"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: (config, _options) => {
    if (!config.css) {
      config.css = {};
    }
    // Vite's postcss path default to root directory. Reconfigure to postcss in .storybook
    config.css.postcss = "./.storybook/postcss.config.js";

    if (!config.resolve) {
      config.resolve = {};
    }
    // Vite failed to load css bundle @yext/chat-ui-react (requires an initial build).
    // Reconfigure to a mock css file since storybook directly uses tailwind anyway.
    config.resolve.alias = {
      ...config.resolve.alias,
      "@yext/chat-ui-react/bundle.css": "./.storybook/mocks/chat-bundle.css",
    };
    return config;
  },
};
export default config;
