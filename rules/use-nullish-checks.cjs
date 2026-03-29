const ts = require("typescript");

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
    schema: [
      {
        type: "object",
        properties: {
          includeBooleans: {
            type: "boolean",
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create: (context) => {
    const includeBooleans = context.options[0]?.includeBooleans ?? false;
    const parserServices =
      context.sourceCode?.parserServices ?? context.parserServices;
    const checker = parserServices?.program?.getTypeChecker();

    const isBooleanType = (node) => {
      if (node.type === "Literal" && typeof node.value === "boolean") {
        return !includeBooleans;
      }

      const isFallbackBoolean = (n) =>
        (n.type === "BinaryExpression" &&
          ["===", "!==", "==", "!=", ">", "<", ">=", "<="].includes(
            n.operator,
          )) ||
        (n.type === "UnaryExpression" && n.operator === "!") ||
        (n.type === "CallExpression" &&
          n.callee.type === "Identifier" &&
          ["isNullish", "nonNullish"].includes(n.callee.name));

      if (!checker || !parserServices) {
        if (includeBooleans) {
          return false;
        }
        return isFallbackBoolean(node);
      }

      try {
        const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
        const type = checker.getTypeAtLocation(tsNode);

        const isStrictBoolean = (t) =>
          (t.getFlags() &
            (ts.TypeFlags.Boolean | ts.TypeFlags.BooleanLiteral)) !==
          0;

        if (isStrictBoolean(type)) {
          return !includeBooleans;
        }

        if (type.isUnion()) {
          const allBooleanLike = type.types.every(
            (t) =>
              (t.getFlags() &
                (ts.TypeFlags.Boolean |
                  ts.TypeFlags.BooleanLiteral |
                  ts.TypeFlags.Null |
                  ts.TypeFlags.Undefined)) !==
              0,
          );
          if (allBooleanLike) {
            return !includeBooleans;
          }
        }
      } catch (_) {
        // Fallback
        if (includeBooleans) {
          return false;
        }
        return isFallbackBoolean(node);
      }

      return false;
    };

    const isNullishLiteral = (node) =>
      (node.type === "Identifier" && node.name === "undefined") ||
      (node.type === "Literal" && node.value === null);

    const report = ({ node, messageId, fixNode }) => {
      context.report({
        node,
        messageId,
        fix: (fixer) =>
          fixer.replaceText(
            node,
            `${messageId}(${context.sourceCode.getText(fixNode)})`,
          ),
      });
    };

    const checkCondition = (node) => {
      if (!node) {
        return;
      }

      if (
        node.type === "CallExpression" &&
        node.callee.type === "Identifier" &&
        ["isNullish", "nonNullish"].includes(node.callee.name)
      ) {
        return;
      }

      if (node.type === "BinaryExpression") {
        const isNullishCheck =
          ["===", "!==", "==", "!="].includes(node.operator) &&
          (isNullishLiteral(node.right) || isNullishLiteral(node.left));
        if (isNullishCheck) {
          return;
        }
      }

      if (node.type === "UnaryExpression" && node.operator === "!") {
        return;
      }

      if (node.type === "LogicalExpression") {
        checkCondition(node.left);
        checkCondition(node.right);
        return;
      }

      if (!isBooleanType(node)) {
        report({ node, messageId: "nonNullish", fixNode: node });
      }
    };

    return {
      BinaryExpression: (node) => {
        if (!["===", "!==", "==", "!="].includes(node.operator)) {
          return;
        }

        let target;
        if (isNullishLiteral(node.right)) {
          target = node.left;
        } else if (isNullishLiteral(node.left)) {
          target = node.right;
        }

        if (target) {
          const messageId = ["===", "=="].includes(node.operator)
            ? "isNullish"
            : "nonNullish";
          report({ node, messageId, fixNode: target });
        }
      },

      UnaryExpression: (node) => {
        // Handle !!foo (Double exclamation)
        if (
          node.operator === "!" &&
          node.argument.type === "UnaryExpression" &&
          node.argument.operator === "!"
        ) {
          if (!isBooleanType(node.argument.argument)) {
            report({
              node,
              messageId: "nonNullish",
              fixNode: node.argument.argument,
            });
          }
        } else if (node.operator === "!" && !isBooleanType(node.argument)) {
          // Skip if parent is another ! (to avoid double reporting in !! case)
          const { parent } = node;
          if (parent?.type === "UnaryExpression" && parent.operator === "!") {
            return;
          }
          report({ node, messageId: "isNullish", fixNode: node.argument });
        }
      },

      "IfStatement, WhileStatement, DoWhileStatement, ForStatement, ConditionalExpression":
        (node) => {
          checkCondition(node.test);
        },
    };
  },
};
