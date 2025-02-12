// eslint-disable-next-line @typescript-eslint/no-var-requires
const { join } = require("node:path");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { existsSync } = require("node:fs");

const resolveProject = () => {
  const eslintJson = join(process.cwd(), "tsconfig.eslint.json");

  if (existsSync(eslintJson)) {
    return eslintJson;
  }

  return join(process.cwd(), "tsconfig.json");
};

module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
    "eslint-plugin-local-rules",
    "import",
    "prefer-arrow",
  ],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
    project: [resolveProject()],
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  overrides: [
    {
      files: ["*.ts"],
      rules: {
        "prefer-const": "error",
      },
    },
    {
      files: ['src/**/*.ts'],
      excludedFiles: ['*.{test,spec,worker,d}.ts'],
      rules: {
        "import/no-unused-modules": [
          "error",
          { missingExports: true, unusedExports: true },
        ],
      },
    },
  ],
  rules: {
    "@typescript-eslint/consistent-type-definitions": "error",
    "@typescript-eslint/consistent-type-imports": "error",
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
    "import/no-duplicates": ["error", { "prefer-inline": true }],
    "import/no-relative-parent-imports": "error",
    "no-console": ["error", { allow: ["error", "warn"] }],
    "no-continue": "warn",
    "no-delete-var": "error",
    "no-else-return": ["warn", { allowElseIf: false }],
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
  globals: {
    NodeJS: true,
  },
};
