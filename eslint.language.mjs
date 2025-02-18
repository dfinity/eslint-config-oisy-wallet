import globals from "globals";
import ts from "typescript-eslint";
import { join } from "node:path";
import { existsSync } from "node:fs";
import { nonNullish } from "@dfinity/utils";

const resolveProject = () => {
  const eslintJson = join(process.cwd(), "tsconfig.eslint.json");

  if (existsSync(eslintJson)) {
    return eslintJson;
  }

  return join(process.cwd(), "tsconfig.json");
};

export const languageOptions = (extraFileExtensions) => ({
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
      NodeJS: true,
    },

    parser: ts.parser,
    ecmaVersion: 2020,
    sourceType: "module",

    parserOptions: {
      project: [resolveProject()],
      ...(nonNullish(extraFileExtensions) && { extraFileExtensions }),
    },
  },
});
