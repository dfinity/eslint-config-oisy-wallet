// TODO: shall we expand it with `==` and `!=` ?
const EQ_OPS = new Set(["==="]);
const NOT_EQ_OPS = new Set(["!=="]);
const COMPARISON_OPS = new Set([...EQ_OPS, ...NOT_EQ_OPS]);

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce the use of isNullish functions for nullish checks",
      category: "Best Practices",
      recommended: false,
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

  create: (context) => {
    const { sourceCode } = context;

    const isNullishLiteral = (expression) =>
      (expression.type === "Identifier" && expression.name === "undefined") ||
      (expression.type === "Literal" && expression.value === null);

    const getNullishComparisonTarget = (node) => {
      if (node.type !== "BinaryExpression") {
        return;
      }

      if (!COMPARISON_OPS.has(node.operator)) {
        return;
      }

      if (isNullishLiteral(node.right)) {
        return node.left;
      }

      if (isNullishLiteral(node.left)) {
        return node.right;
      }
    };

    const getNullishReplacement = (operator) =>
      EQ_OPS.has(operator) ? "isNullish" : "nonNullish";

    const report = ({ node, messageId, replacementFn, fixNode }) => {
      context.report({
        node,
        messageId,
        fix: (fixer) =>
          fixer.replaceText(
            node,
            `${replacementFn}(${sourceCode ? sourceCode.getText(fixNode) : context.getSourceCode().getText(fixNode)})`,
          ),
      });
    };

    return {
      BinaryExpression: (node) => {
        const target = getNullishComparisonTarget(node);

        if (!target) {
          return;
        }

        const replacementFn = getNullishReplacement(node.operator);

        report({
          node,
          messageId: replacementFn,
          replacementFn,
          fixNode: target,
        });
      },
    };
  },
};
