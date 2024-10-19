module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce passing parameters as an object when a function has more than one parameter",
      category: "Best Practices",
      recommended: true,
    },
    schema: [],
  },
  create: (context) => {
    const checkForMoreThanOneParameter = (node) => {
      const parent = node.parent;

      const nonNullish = (element) => element !== undefined && element !== null;

      // Check if it is a callback for looping methods
      if (
        nonNullish(parent) &&
        parent.type === "CallExpression" &&
        parent.callee.type === "MemberExpression" &&
        [
          "map",
          "reduce",
          "forEach",
          "filter",
          "sort",
          "replace",
          "concat",
          "copyWithin",
          "every",
          "fill",
          "find",
          "findIndex",
          "findLast",
          "findLastIndex",
          "flatMap",
          "includes",
          "indexOf",
          "lastIndexOf",
          "push",
          "reduce",
          "reduceRight",
          "slice",
          "splice",
          "toLocaleString",
          "toSpliced",
          "unshift",
          "with",
        ].includes(parent.callee.property.name)
      ) {
        return;
      }

      // Check if it is a callback for Array.from
      if (
        nonNullish(parent) &&
        parent.type === "CallExpression" &&
        parent.callee.type === "MemberExpression" &&
        parent.callee.object.name === "Array" &&
        parent.callee.property.name === "from"
      ) {
        return;
      }

      // Check if it is a callback in a Promise constructor
      if (
        nonNullish(parent) &&
        parent.type === "NewExpression" &&
        parent.callee.name === "Promise"
      ) {
        return;
      }

      // Check if it is a callback in JSON.stringify
      if (
        nonNullish(parent) &&
        parent.type === "CallExpression" &&
        parent.callee.type === "MemberExpression" &&
        parent.callee.object.name === "JSON" &&
        parent.callee.property.name === "stringify"
      ) {
        return;
      }

      // Check if it is inside a class constructor
      if (
        nonNullish(parent) &&
        parent.type === "MethodDefinition" &&
        parent.kind === "constructor"
      ) {
        return;
      }

      if (node.params.length > 1) {
        context.report({
          node,
          message:
            "Functions with more than one parameter should accept an object and use destructuring.",
        });
      }
    };

    return {
      FunctionDeclaration: (node) => {
        checkForMoreThanOneParameter(node);
      },
      FunctionExpression: (node) => {
        checkForMoreThanOneParameter(node);
      },
      ArrowFunctionExpression: (node) => {
        checkForMoreThanOneParameter(node);
      },
    };
  },
};
