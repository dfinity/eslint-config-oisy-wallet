module.exports = {
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
  create: (context) => {
    const checkForOptionType = (node) => {
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
          type.type === "TSTypeReference" && type.typeName && type.typeName.name
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
              fix: (fixer) =>
                fixer.replaceText(node.typeAnnotation, `Option<${typeText}>`),
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
      TSTypeAnnotation: (node) => {
        checkForOptionType(node);
      },
      TSTypeAliasDeclaration: (node) => {
        checkForOptionType(node);
      },
    };
  },
};
