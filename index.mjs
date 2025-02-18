import typescriptEslint from "@typescript-eslint/eslint-plugin";
import localRules from "eslint-plugin-local-rules";
import _import from "eslint-plugin-import";
import preferArrow from "eslint-plugin-prefer-arrow";
import { fixupPluginRules } from "@eslint/compat";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import { dirname, join } from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const resolveProject = () => {
  const eslintJson = join(process.cwd(), "tsconfig.eslint.json");

  if (existsSync(eslintJson)) {
    return eslintJson;
  }

  return join(process.cwd(), "tsconfig.json");
};

export default [
  ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ),
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
      "local-rules": localRules,
      import: fixupPluginRules(_import),
      "prefer-arrow": preferArrow,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        NodeJS: true,
      },

      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: "module",

      parserOptions: {
        project: [resolveProject()],
      },
    },

    rules: {
      "@typescript-eslint/consistent-type-definitions": "error",
      "@typescript-eslint/no-inferrable-types": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-reduce-type-parameter": "error",
      "arrow-body-style": ["warn", "as-needed"],
      curly: "error",
      "func-style": "error",
      "local-rules/prefer-object-params": "warn",
      "local-rules/use-nullish-checks": "warn",
      "local-rules/use-option-type-wrapper": "warn",

      "import/no-duplicates": [
        "error",
        {
          "prefer-inline": true,
        },
      ],

      "import/no-relative-parent-imports": "error",

      "no-console": [
        "error",
        {
          allow: ["error", "warn"],
        },
      ],

      "no-continue": "warn",
      "no-delete-var": "error",

      "no-else-return": [
        "warn",
        {
          allowElseIf: false,
        },
      ],

      "no-unused-vars": "off",
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
