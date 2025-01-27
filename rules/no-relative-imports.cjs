module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow all relative imports",
      category: "Best Practices",
      recommended: false,
    },
    messages: {
      noRelativeImports:
        "Relative imports are not allowed. Use an alias or absolute imports.",
    },
    schema: [],
  },
  create: (context) => ({
    ImportDeclaration: (node) => {
      const path = node.source.value;

      if (path.startsWith("./")) {
        context.report({
          node,
          messageId: "noRelativeImports",
        });
      }
    },
  }),
};
