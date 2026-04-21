const { nonNullish } = require("@dfinity/utils");
module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce use of Nullish<T> instead of T | null | undefined",
      category: "Best Practices",
      recommended: false,
    },
    messages: {
      useNullish:
        "Use Nullish<{{ type }}> instead of {{ type }} | null | undefined.",
    },
    fixable: "code",
    schema: [],
  },
  create: (context) => {
    const checkForNullishType = (node) => {
      if (
        node.typeAnnotation.type === "TSUnionType" &&
        node.typeAnnotation.types.length === 3 &&
        node.typeAnnotation.types.some((t) => t.type === "TSNullKeyword") &&
        node.typeAnnotation.types.some((t) => t.type === "TSUndefinedKeyword")
      ) {
        const type = node.typeAnnotation.types.find(
          (t) => t.type !== "TSNullKeyword" && t.type !== "TSUndefinedKeyword",
        );

        const typeText =
          type.type === "TSTypeReference" &&
          nonNullish(type.typeName) &&
          nonNullish(type.typeName.name)
            ? type.typeName.name
            : context.getSourceCode().getText(type);

        if (nonNullish(type)) {
          try {
            context.report({
              node,
              messageId: "useNullish",
              data: {
                type: typeText,
              },
              fix: (fixer) =>
                fixer.replaceText(node.typeAnnotation, `Nullish<${typeText}>`),
            });
          } catch (e) {
            console.error(e);
            // eslint-disable-next-line no-console
            console.log(type);
          }
        }
      }
    };

    return {
      TSTypeAnnotation: (node) => {
        checkForNullishType(node);
      },
      TSTypeAliasDeclaration: (node) => {
        checkForNullishType(node);
      },
    };
  },
};
