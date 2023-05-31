module.exports = {
  extends: [
    "@yext/eslint-config/typescript-react",
    "plugin:storybook/recommended",
  ],
  ignorePatterns: ["**/lib", "**/dist", "**/build", "**/coverage", "*.d.ts"],
  overrides: [
    {
      files: ["**/*.{test,stories}.*"],
      rules: {
        "react-perf/jsx-no-new-array-as-prop": "off",
        "react-perf/jsx-no-new-function-as-prop": "off",
        "react-perf/jsx-no-new-object-as-prop": "off",
      },
    },
  ],
};
