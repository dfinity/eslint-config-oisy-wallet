import localRules from "eslint-plugin-local-rules";
import preferArrow from "eslint-plugin-prefer-arrow";
import { join } from "node:path";
import { existsSync } from "node:fs";
import { fixupPluginRules, includeIgnoreFile } from "@eslint/compat";
import _import from "eslint-plugin-import";
import { fileURLToPath } from "node:url";
import { nonNullish } from "@dfinity/utils";

const resolveGitIgnorePath = () => {
  const gitIgnore = join(process.cwd(), ".gitignore");

  if (existsSync(gitIgnore)) {
    return fileURLToPath(new URL(gitIgnore, import.meta.url));
  }

  return undefined;
};

const gitignorePath = resolveGitIgnorePath();

/**
 * The rules below are part of the typescript-eslint `recommended-type-checked` ruleset.
 *
 * If at some point we have enough of them, we can switch the ruleset on,
 * turn off the ones that we don't want, and remove this section.
 *
 * @link {https://typescript-eslint.io/users/configs/#recommended-type-checked}
 * @link {https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/eslintrc/recommended-type-checked.ts}
 */
const partialTypeCheckedRules = {
  "@typescript-eslint/no-unnecessary-type-assertion": "error",
  "@typescript-eslint/no-unused-vars": [
    "warn",
    {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
      caughtErrorsIgnorePattern: "^_",
    },
  ],
};

export const eslintRules = [
  ...(nonNullish(gitignorePath) ? [includeIgnoreFile(gitignorePath)] : []),
  {
    plugins: {
      "local-rules": localRules,
      "prefer-arrow": preferArrow,
      import: fixupPluginRules(_import),
    },

    rules: {
      ...partialTypeCheckedRules,

      "@typescript-eslint/consistent-type-definitions": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/no-inferrable-types": "error",
      "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-reduce-type-parameter": "error",

      "arrow-body-style": ["warn", "as-needed"],
      curly: "error",
      "func-style": "error",

      "local-rules/prefer-object-params": "warn",

      "import/no-duplicates": ["error", { "prefer-inline": true }],
      "import/no-relative-parent-imports": "error",

      "object-shorthand": "error",
      "prefer-destructuring": "error",
      "no-console": ["error", { allow: ["error", "warn"] }],
      "no-continue": "warn",
      "no-delete-var": "error",
      "no-else-return": ["warn", { allowElseIf: false }],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/dist/**"],
              message:
                "Do not import directly from a package's /dist/ folder. Use the package's public entry point instead.",
            },
          ],
        },
      ],
      "no-unused-vars": "off",
      "no-useless-rename": "error",
      "no-useless-return": "error",
      "prefer-arrow-callback": "error",

      "prefer-arrow/prefer-arrow-functions": [
        "error",
        {
          disallowPrototype: true,
          singleReturnOnly: false,
          classPropertiesAllowed: false,
        },
      ],

      "prefer-template": "error",
      "require-await": "error",
    },
  },

  {
    files: ["**/*.ts"],

    rules: {
      "prefer-const": "error",
    },
  },
];
