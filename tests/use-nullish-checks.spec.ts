import { RuleTester } from "@typescript-eslint/rule-tester";

const rule = require("../rules/use-nullish-checks.cjs");

const ruleTester = new RuleTester();

ruleTester.run("use-nullish-checks", rule, {
  valid: [
    {
      code: "isNullish(foo);",
    },
    {
      code: "nonNullish(bar);",
    },
    {
      code: "array.find(item => item) === null;",
      options: [{ allowFindUndefinedCheck: true }],
    },
    {
      code: "array.find(item => item) !== undefined;",
      options: [{ allowFindUndefinedCheck: true }],
    },
  ],

  invalid: [
    {
      code: "foo === null;",
      errors: [{ messageId: "isNullish" }],
      output: "isNullish(foo);",
    },
    {
      code: "foo !== undefined;",
      errors: [{ messageId: "nonNullish" }],
      output: "nonNullish(foo);",
    },
    {
      code: "array.find(item => item) === null;",
      errors: [{ messageId: "isNullish" }],
      output: "isNullish(array.find(item => item));",
      options: [{ allowFindUndefinedCheck: false }],
    },
    {
      code: "array.find(item => item) !== undefined;",
      errors: [{ messageId: "nonNullish" }],
      output: "nonNullish(array.find(item => item));",
      options: [{ allowFindUndefinedCheck: false }],
    },
  ],
});
