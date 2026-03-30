const ts = require("typescript");

const NULLISH_UTILS = new Set(["isNullish", "nonNullish"]);

// TODO: shall we expand it with `==` and `!=` ?
const EQ_OPS = new Set(["==="]);
const NOT_EQ_OPS = new Set(["!=="]);
const COMPARISON_OPS = new Set([...EQ_OPS, ...NOT_EQ_OPS]);
const BOOLEAN_BINARY_OPS = new Set([...COMPARISON_OPS, ">", "<", ">=", "<="]);
const KNOWN_BOOLEAN_METHODS = new Set([
  "includes",
  "startsWith",
  "endsWith",
  "test",
  "some",
  "every",
]);

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

    const parserServices = sourceCode?.parserServices ?? context.parserServices;

    const checker = parserServices?.program?.getTypeChecker();

    const isNullishUtilityCall = (node) =>
      node.type === "CallExpression" &&
      node.callee.type === "Identifier" &&
      NULLISH_UTILS.has(node.callee.name);

    const hasKnownBooleanMethodCall = (node) =>
      node.type === "CallExpression" &&
      node.callee.type === "MemberExpression" &&
      node.callee.property.type === "Identifier" &&
      KNOWN_BOOLEAN_METHODS.has(node.callee.property.name);

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

    const findVariableTypeAnnotation = ({ scope, variableName }) => {
      if (!scope) {
        return;
      }

      const variable = scope.set.get(variableName);
      const [def] = variable?.defs ?? [];

      const typeAnn =
        def?.node?.id?.typeAnnotation?.typeAnnotation ??
        def?.node?.typeAnnotation?.typeAnnotation;

      return (
        typeAnn ??
        findVariableTypeAnnotation({ scope: scope.upper, variableName })
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

      if (isNullishUtilityCall(node)) {
        return true;
      }

      if (hasKnownBooleanMethodCall(node)) {
        return true;
      }

      if (node.type !== "Identifier") {
        return false;
      }

      const initialScope = sourceCode?.getScope
        ? sourceCode.getScope(node)
        : context.getScope();

      const typeAnn = findVariableTypeAnnotation({
        scope: initialScope,
        variableName: node.name,
      });

      return isBooleanTypeAnnotation(typeAnn);
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

    const shouldTreatAsBooleanCondition = (node) => {
      try {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        return isBooleanTypeFromTs(node) || isBooleanTypeFromScope(node);
      } catch {
        return isBooleanTypeFromScope(node);
      }
    };

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

      UnaryExpression: (node) => {
        if (
          node.operator === "!" &&
          node.argument.type === "UnaryExpression" &&
          node.argument.operator === "!"
        ) {
          if (shouldTreatAsBooleanCondition(node.argument.argument)) {
            return;
          }

          report({
            node,
            messageId: "nonNullish",
            replacementFn: "nonNullish",
            fixNode: node.argument.argument,
          });

          return;
        }

        if (node.operator === "!") {
          if (shouldTreatAsBooleanCondition(node.argument.argument)) {
            return;
          }

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
    };
  },
};
