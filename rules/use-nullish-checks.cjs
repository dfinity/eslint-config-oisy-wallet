module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce the use of isNullish functions for nullish checks",
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
    schema: [
      {
        type: "object",
        properties: {
          allowFindUndefinedCheck: {
            type: "boolean",
            default: false,
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const ignoreFind = options.allowFindUndefinedCheck || false;

    const binaryCheck = (node) => {
      if (node.type === "BinaryExpression") {
        const isNullishCheck =
          (node.operator === "===" || node.operator === "!==") &&
          ((node.right.type === "Identifier" &&
            node.right.name === "undefined") ||
            // eslint-disable-next-line local-rules/use-nullish-checks -- This is the statement to check if the right side is null, not undefined
            (node.right.type === "Literal" && node.right.value === null));

        if (ignoreFind) {
          const isFind =
            node.left &&
            node.left.type === "CallExpression" &&
            node.left.callee &&
            node.left.callee.type === "MemberExpression" &&
            node.left.callee.property &&
            node.left.callee.property.name === "find";

          if (isFind) {
            return false;
          }
        }

        return isNullishCheck;
      }
    };

    const binaryReportCheck = (node) => {
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
};
