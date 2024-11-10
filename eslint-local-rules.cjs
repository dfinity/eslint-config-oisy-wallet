module.exports = {
  "use-nullish-checks": {
    meta: {
      type: "suggestion",
      docs: {
        description:
          "Enforce the use of isNullish functions for nullish checks",
        category: "Best Practices",
        recommended: true,
      },
      messages: {
        isNullish:
          "Use isNullish() instead of direct variable check for nullish checks.",
        nonNullish:
          "Use nonNullish() instead of direct variable check for nullish checks.",
      },
      fixable: "code",
      schema: [],
    },
    create(context) {
      const binaryCheck = (node) => {
        if (node.type === "BinaryExpression") {
          return (
            (node.operator === "===" || node.operator === "!==") &&
            ((node.right.type === "Identifier" &&
              node.right.name === "undefined") ||
              (node.right.type === "Literal" && node.right.value === null))
          );
        }
      };

      const binaryReportCheck = (node) => {
        context.report({
          node,
          messageId: node.operator === "===" ? "isNullish" : "nonNullish",
          fix(fixer) {
            return fixer.replaceText(
              node,
              `${node.operator === "===" ? "isNullish" : "nonNullish"}(${context.getSourceCode().getText(node.left)})`,
            );
          },
        });
      };

      return {
        BinaryExpression(node) {
          if (binaryCheck(node)) {
            binaryReportCheck(node);
          }
        },
      };
    },
  },
  "no-svelte-store-in-api": require("./rules/no-svelte-store-in-api.cjs"),
  "use-option-type-wrapper": require("./rules/use-option-type-wrapper.cjs"),
  "prefer-object-params": require("./rules/prefer-object-params.cjs"),
  "no-relative-imports": require("./rules/no-relative-imports.cjs"),
  "explicit-non-void-return-type": require("./rules/explicit-non-void-return-type.cjs"),
};
