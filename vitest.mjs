import vitest from "@vitest/eslint-plugin";
import { languageOptions } from "./configs/eslint.language.mjs";
import { eslintCoreConfig } from "./configs/eslint.core.mjs";

export default [
  ...eslintCoreConfig,
  {
    plugins: { vitest },
    rules: {
      ...vitest.configs.recommended.rules,

      "vitest/no-alias-methods": ["error"],
      "vitest/no-duplicate-hooks": ["error"],
      "vitest/padding-around-all": ["error"],
      "vitest/prefer-comparison-matcher": ["error"],
      "vitest/prefer-hooks-in-order": ["error"],
      "vitest/prefer-hooks-on-top": ["error"],
      "vitest/prefer-to-be-falsy": ["error"],
      "vitest/prefer-to-be-object": ["error"],
      "vitest/prefer-to-be-truthy": ["error"],
      "vitest/prefer-to-contain": ["error"],
      "vitest/prefer-to-have-length": ["error"],
    },
  },
  languageOptions(),
];
