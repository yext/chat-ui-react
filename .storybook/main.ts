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
    //vite's postcss path default to root directory. Reconfigure to .storybook
    config.css.postcss = "./.storybook/postcss.config.js";
    return config;
  },
};
export default config;
