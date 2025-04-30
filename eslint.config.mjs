import { default as config } from "./index.mjs";

export default [
  ...config,
  {
    files: ["**/*.ts", "**/*.mjs", "**/*.cjs", "**/*.js"],
  },
  {
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];
