import svelte from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";
import ts from "typescript-eslint";
import { join } from "node:path";
import { nonNullish } from "@dfinity/utils";
import { languageOptions } from "./configs/eslint.language.mjs";
import { eslintCoreConfig } from "./configs/eslint.core.mjs";

const svelteConfig = join(process.cwd(), "svelte.config.js");

export default [
  ...eslintCoreConfig,
  ...svelte.configs["flat/recommended"],
  ...svelte.configs["flat/prettier"],
  languageOptions([".svelte"]),

  {
    files: ["**/*.svelte"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: ts.parser,
        ...(nonNullish(svelteConfig) && { svelteConfig }),
      },
    },
  },

  {
    files: ["**/*.svelte"],
    rules: {
      "import/order": [
        "error",
        {
          alphabetize: {
            order: "asc",
          },
        },
      ],
    },
  },

  {
    rules: {
      "svelte/shorthand-attribute": ["error"],
      "svelte/shorthand-directive": ["error"],
      "svelte/spaced-html-comment": ["error"],
    },
  },

  {
    files: ["scripts/**/*.mjs", "scripts/**/*.ts"],

    rules: {
      "no-console": "off",
    },
  },
  {
    rules: {
      // TODO: Fix after migration to Svelte v5
      "no-constant-binary-expression": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },
];
