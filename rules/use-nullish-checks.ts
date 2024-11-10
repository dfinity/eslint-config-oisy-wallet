import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";

type NodeType = TSESTree.BinaryExpression;

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://example.com/rule/${name}`,
);

export default createRule({
  name: "use-nullish-checks",
  defaultOptions: [],
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce the use of isNullish functions for nullish checks",
      // category: "Best Practices",
      // recommended: true,
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
    const binaryCheck = (node: NodeType) => {
      if (node.type === "BinaryExpression") {
        return (
          (node.operator === "===" || node.operator === "!==") &&
          ((node.right.type === "Identifier" &&
            node.right.name === "undefined") ||
            (node.right.type === "Literal" && node.right.value === null))
        );
      }
    };

    const binaryReportCheck = (node: NodeType) => {
      context.report({
        node,
        messageId: node.operator === "===" ? "isNullish" : "nonNullish",
        fix(fixer) {
          return fixer.replaceText(
            node,
            `${node.operator === "===" ? "isNullish" : "nonNullish"}(${context.sourceCode.getText(node.left)})`,
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
});
