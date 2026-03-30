import { RuleTester } from "@typescript-eslint/rule-tester";
const rule = require("../rules/use-nullish-type-wrapper.cjs");

const ruleTester = new RuleTester();

ruleTester.run("use-option-type-wrapper", rule, {
  valid: [
    {
      code: `type MyType = Option<string>;`,
    },
    {
      code: `type MyType = string;`,
    },
    {
      code: `type MyType = Option<number>;`,
    },
    {
      code: `type MyType = number | undefined;`,
    },
    {
      code: `type MyType = number | null;`,
    },
  ],

  invalid: [
    {
      code: `type MyType = string | null | undefined;`,
      errors: [{ messageId: "useNullish", data: { type: "string" } }],
      output: `type MyType = Nullish<string>;`,
    },
    {
      code: `type MyType = number | null | undefined;`,
      errors: [{ messageId: "useNullish", data: { type: "number" } }],
      output: `type MyType = Nullish<number>;`,
    },
    {
      code: `type MyType = MyCustomType | null | undefined;`,
      errors: [{ messageId: "useNullish", data: { type: "MyCustomType" } }],
      output: `type MyType = Nullish<MyCustomType>;`,
    },
    {
      code: `type MyType = boolean | null | undefined;`,
      errors: [{ messageId: "useNullish", data: { type: "boolean" } }],
      output: `type MyType = Nullish<boolean>;`,
    },
  ],
});
