const useNullishChecks = require("./rules/use-nullish-checks.ts");

module.exports = {
  "no-svelte-store-in-api": require("./rules/no-svelte-store-in-api.cjs"),
  "use-option-type-wrapper": require("./rules/use-option-type-wrapper.cjs"),
  "prefer-object-params": require("./rules/prefer-object-params.cjs"),
  "no-relative-imports": require("./rules/no-relative-imports.cjs"),
  "explicit-non-void-return-type": require("./rules/explicit-non-void-return-type.cjs"),
  "use-nullish-checks": useNullishChecks,
};
