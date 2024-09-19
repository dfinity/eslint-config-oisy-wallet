module.exports = {
  extends: ["./index.cjs", "plugin:svelte/recommended"],
  parserOptions: {
    extraFileExtensions: [".svelte"],
  },
  overrides: [
    {
      files: ["*.svelte"],
      parser: "svelte-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
      },
      rules: {
        "import/order": [
          "error",
          {
            alphabetize: { order: "asc" },
          },
        ],
      },
    },
    {
      files: ["scripts/**/*.mjs", "scripts/**/*.ts"],
      rules: {
        "no-console": "off",
      },
    },
  ],
  rules: {
    "local-rules/no-svelte-store-in-api": "error",
  },
};
