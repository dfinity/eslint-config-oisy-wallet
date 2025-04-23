const inferReturnType = (node) => {
  if (node.async) {
    if (
      node.body.type === "BlockStatement" &&
      !node.body.body.some((statement) => statement.type === "ReturnStatement")
    ) {
      return "Promise<void>";
    }
    return "Promise<unknown>";
  }

  if (
    node.body.type === "BlockStatement" &&
    !node.body.body.some((statement) => statement.type === "ReturnStatement")
  ) {
    return "void";
  }

  const returnStatements = node.body.body.filter(
    (statement) => statement.type === "ReturnStatement",
  );

  if (returnStatements.length > 0) {
    const returnArgument = returnStatements[0].argument;

    if (returnArgument) {
      if (returnArgument.type === "Literal") {
        return typeof returnArgument.value;
      }

      if (returnArgument.type === "ObjectExpression") {
        return "{}";
      }
    }
  }

  return "unknown";
};

const checkReturnType = ({ node, context }) => {
  const { returnType } = node;

  if (!returnType) {
    const inferredType = inferReturnType(node);

    if (inferredType !== "void" && inferredType !== "Promise<void>") {
      context.report({
        node,
        messageId: "missingReturnType",
      });
    }
  }
};

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Require explicit return types for functions, except when returning void",
      category: "Best Practices",
      recommended: false,
    },
    messages: {
      missingReturnType:
        "Function return type must be explicitly defined unless it returns void.",
    },
    schema: [],
  },

  create: (context) => ({
    FunctionDeclaration: (node) => {
      checkReturnType({ node, context });
    },
    FunctionExpression: (node) => {
      checkReturnType({ node, context });
    },
    ArrowFunctionExpression: (node) => {
      checkReturnType({ node, context });
    },
  }),
};
