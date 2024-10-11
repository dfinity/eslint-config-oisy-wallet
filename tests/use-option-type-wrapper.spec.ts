import { RuleTester } from "@typescript-eslint/rule-tester";

const rule = require("../rules/use-option-type-wrapper");

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
      errors: [{ messageId: "useOption", data: { type: "string" } }],
      output: `type MyType = Option<string>;`,
    },
    {
      code: `type MyType = number | null | undefined;`,
      errors: [{ messageId: "useOption", data: { type: "number" } }],
      output: `type MyType = Option<number>;`,
    },
    {
      code: `type MyType = MyCustomType | null | undefined;`,
      errors: [{ messageId: "useOption", data: { type: "MyCustomType" } }],
      output: `type MyType = Option<MyCustomType>;`,
    },
    {
      code: `type MyType = boolean | null | undefined;`,
      errors: [{ messageId: "useOption", data: { type: "boolean" } }],
      output: `type MyType = Option<boolean>;`,
    },
  ],
});
