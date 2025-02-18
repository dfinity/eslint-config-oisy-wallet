import js from "@eslint/js";
import ts from "typescript-eslint";
import prettier from "eslint-config-prettier";
import { eslintRules } from "./eslint.rules.mjs";
import { eslintIgnore } from "./eslint.ignore.mjs";

export const eslintCoreConfig = [
  js.configs.recommended,
  ...ts.configs.recommended,
  prettier,
  ...eslintRules,
  ...eslintIgnore,
];
