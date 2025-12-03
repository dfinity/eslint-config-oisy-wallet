import ts from "typescript-eslint";
import { languageOptions } from "./configs/eslint.language.mjs";
import yml from "eslint-plugin-yml";
import { join } from "node:path";
import { nonNullish } from "@dfinity/utils";

const yamlConfig = join(process.cwd(), "yaml.config.js");

export default [
  ...yml.configs["flat/prettier"],
  languageOptions([".yaml", ".yml"]),

  {
    files: ["**/*.yaml", "**/*.yml"],
    languageOptions: {
      parser: "yaml-eslint-parser",
      parserOptions: {
        parser: ts.parser,
        ...(nonNullish(yamlConfig) && { yamlConfig }),
      },
    },
  },

  {
    files: ["**/*.yaml", "**/*.yml"],
    rules: {
      "yml/no-empty-mapping-value": "off",
    },
  },
];
