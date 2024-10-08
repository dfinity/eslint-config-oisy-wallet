module.exports = {
  "no-svelte-store-in-api": {
    meta: {
      docs: {
        description:
          "Svelte stores should not be used in APIs since they are also utilized by workers.",
        category: "Possible Errors",
        recommended: false,
      },
      schema: [],
    },
    create(context) {
      return {
        ImportDeclaration(node) {
          const filePath = context.getFilename();

          const {
            source: { value },
          } = node;

          if (filePath.includes("/api/") && value === "svelte/store") {
            context.report({
              node,
              message:
                "Importing 'svelte/store' is not allowed in API modules.",
            });
          }
        },
      };
    },
  },
  "use-option-type-wrapper": {
    meta: {
      type: "suggestion",
      docs: {
        description: "Enforce use of Option<T> instead of T | null | undefined",
        category: "Best Practices",
        recommended: true,
      },
      messages: {
        useOption:
          "Use Option<{{ type }}> instead of {{ type }} | null | undefined.",
      },
      fixable: "code",
      schema: [],
    },
    create: function (context) {
      const checkForOptionType = (node) => {
        if (
          node.typeAnnotation.type === "TSUnionType" &&
          node.typeAnnotation.types.length === 3 &&
          node.typeAnnotation.types.some((t) => t.type === "TSNullKeyword") &&
          node.typeAnnotation.types.some((t) => t.type === "TSUndefinedKeyword")
        ) {
          const type = node.typeAnnotation.types.find(
            (t) =>
              t.type !== "TSNullKeyword" && t.type !== "TSUndefinedKeyword",
          );

          const typeText =
            type.type === "TSTypeReference" &&
            type.typeName &&
            type.typeName.name
              ? type.typeName.name
              : context.getSourceCode().getText(type);

          if (type) {
            try {
              context.report({
                node,
                messageId: "useOption",
                data: {
                  type: typeText,
                },
                fix(fixer) {
                  return fixer.replaceText(
                    node.typeAnnotation,
                    `Option<${typeText}>`,
                  );
                },
              });
            } catch (e) {
              // eslint-disable-next-line no-console
              console.error(e);
              // eslint-disable-next-line no-console
              console.log(type);
            }
          }
        }
      };

      return {
        TSTypeAnnotation(node) {
          checkForOptionType(node);
        },
        TSTypeAliasDeclaration(node) {
          checkForOptionType(node);
        },
      };
    },
  },
  "prefer-object-params": {
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
    create(context) {
      const checkForMoreThanOneParameter = (node) => {
        const parent = node.parent;

        const nonNullish = (element) =>
          element !== undefined && element !== null;

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
        FunctionDeclaration(node) {
          checkForMoreThanOneParameter(node);
        },
        FunctionExpression(node) {
          checkForMoreThanOneParameter(node);
        },
        ArrowFunctionExpression(node) {
          checkForMoreThanOneParameter(node);
        },
      };
    },
  },
  "no-relative-imports": {
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
    create(context) {
      return {
        ImportDeclaration(node) {
          const path = node.source.value;

          if (path.startsWith("./")) {
            context.report({
              node,
              messageId: "noRelativeImports",
            });
          }
        },
      };
    },
  },
};
