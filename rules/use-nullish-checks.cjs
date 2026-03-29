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
    const NULLISH_UTILS = new Set(["isNullish", "nonNullish"]);
    const NULLISH_COMPARISON_OPS = new Set(["===", "!==", "==", "!="]);
    const BOOLEAN_BINARY_OPS = new Set([
      "===",
      "!==",
      "==",
      "!=",
      ">",
      "<",
      ">=",
      "<=",
    ]);
    const NULLISH_EQ_OPS = new Set(["===", "=="]);

    const includeBooleans = context.options[0]?.includeBooleans ?? false;

    const parserServices =
      context.sourceCode?.parserServices ?? context.parserServices;

    const checker = parserServices?.program?.getTypeChecker();

    const hasNullishUtilityCall = (node) =>
      node.type === "CallExpression" &&
      node.callee.type === "Identifier" &&
      NULLISH_UTILS.has(node.callee.name);

    const isBooleanBinaryExpression = (node) =>
      node.type === "BinaryExpression" && BOOLEAN_BINARY_OPS.has(node.operator);

    const isBooleanTypeAnnotation = (typeAnn) => {
      if (!typeAnn) {
        return false;
      }

      if (typeAnn.type === "TSBooleanKeyword") {
        return true;
      }

      if (typeAnn.type !== "TSUnionType") {
        return false;
      }

      return typeAnn.types.every(
        (typeNode) =>
          typeNode.type === "TSBooleanKeyword" ||
          typeNode.type === "TSNullKeyword" ||
          typeNode.type === "TSUndefinedKeyword" ||
          (typeNode.type === "TSLiteralType" &&
            typeof typeNode.literal?.value === "boolean"),
      );
    };

    const isBooleanTypeFromScope = (node) => {
      if (node.type === "Literal" && typeof node.value === "boolean") {
        return true;
      }

      if (isBooleanBinaryExpression(node)) {
        return true;
      }

      if (node.type === "UnaryExpression" && node.operator === "!") {
        return true;
      }

      if (hasNullishUtilityCall(node)) {
        return true;
      }

      if (node.type !== "Identifier") {
        return false;
      }

      let scope = context.sourceCode.getScope
        ? context.sourceCode.getScope(node)
        : context.getScope();

      while (scope) {
        const variable = scope.set.get(node.name);
        const [def] = variable?.defs ?? [];

        const typeAnn =
          def?.node?.id?.typeAnnotation?.typeAnnotation ??
          def?.node?.typeAnnotation?.typeAnnotation;

        if (isBooleanTypeAnnotation(typeAnn)) {
          return true;
        }

        scope = scope.upper;
      }

      return false;
    };

    const isBooleanTypeFromTs = (node) => {
      if (!checker || !parserServices) {
        return false;
      }

      const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
      const type = checker.getTypeAtLocation(tsNode);

      const isStrictBoolean = (typeToCheck) =>
        (typeToCheck.getFlags() &
          (ts.TypeFlags.Boolean | ts.TypeFlags.BooleanLiteral)) !==
        0;

      if (isStrictBoolean(type)) {
        return true;
      }

      return (
        type.isUnion() &&
        type.types.every(
          (typeToCheck) =>
            (typeToCheck.getFlags() &
              (ts.TypeFlags.Boolean |
                ts.TypeFlags.BooleanLiteral |
                ts.TypeFlags.Null |
                ts.TypeFlags.Undefined)) !==
            0,
        )
      );
    };

    const isBooleanType = (node) => {
      if (includeBooleans) {
        return false;
      }

      try {
        const fromTs = isBooleanTypeFromTs(node);
        if (fromTs) {
          return true;
        }
        return isBooleanTypeFromScope(node);
      } catch {
        return isBooleanTypeFromScope(node);
      }
    };

    const isNullishLiteral = (node) =>
      (node.type === "Identifier" && node.name === "undefined") ||
      (node.type === "Literal" && node.value === null);

    const getNullishComparisonTarget = (node) => {
      if (
        node.type !== "BinaryExpression" ||
        !NULLISH_COMPARISON_OPS.has(node.operator)
      ) {
        return undefined;
      }

      if (isNullishLiteral(node.right)) {
        return node.left;
      }

      if (isNullishLiteral(node.left)) {
        return node.right;
      }

      return undefined;
    };

    const report = ({ node, messageId, replacementFn, fixNode }) => {
      context.report({
        node,
        messageId,
        fix: (fixer) =>
          fixer.replaceText(
            node,
            `${replacementFn}(${context.sourceCode.getText(fixNode)})`,
          ),
      });
    };

    const checkCondition = (node) => {
      if (!node) {
        return;
      }

      if (hasNullishUtilityCall(node) || getNullishComparisonTarget(node)) {
        return;
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
        report({
          node,
          messageId: "nonNullish",
          replacementFn: "nonNullish",
          fixNode: node,
        });
      }
    };

    const checkTest = (node) => {
      checkCondition(node.test);
    };

    return {
      BinaryExpression: (node) => {
        const target = getNullishComparisonTarget(node);

        if (!target) {
          return;
        }

        const isPositiveCheck = NULLISH_EQ_OPS.has(node.operator);

        report({
          node,
          messageId: isPositiveCheck ? "isNullish" : "nonNullish",
          replacementFn: isPositiveCheck ? "isNullish" : "nonNullish",
          fixNode: target,
        });
      },

      UnaryExpression: (node) => {
        if (
          node.operator === "!" &&
          node.argument.type === "UnaryExpression" &&
          node.argument.operator === "!"
        ) {
          if (!isBooleanType(node.argument.argument)) {
            report({
              node,
              messageId: "nonNullish",
              replacementFn: "nonNullish",
              fixNode: node.argument.argument,
            });
          }
        } else if (node.operator === "!" && !isBooleanType(node.argument)) {
          const { parent } = node;

          if (parent?.type === "UnaryExpression" && parent.operator === "!") {
            return;
          }

          report({
            node,
            messageId: "isNullish",
            replacementFn: "isNullish",
            fixNode: node.argument,
          });
        }
      },

      IfStatement: checkTest,
      WhileStatement: checkTest,
      DoWhileStatement: checkTest,
      ForStatement: checkTest,
      ConditionalExpression: checkTest,
    };
  },
};
