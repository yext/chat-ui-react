import tailwindConfig from "./tailwind.config";

module.exports = {
  ...tailwindConfig,
  corePlugins: {
    preflight: false
  }
};
