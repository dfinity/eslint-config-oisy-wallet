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
      code: "if (a === b) {}",
    },
    {
      code: "if (a !== b) {}",
    },
    {
      code: "if (a > b) {}",
    },
    {
      code: "if (a < b) {}",
    },
    {
      code: "if (!nonNullish(foo)) {}",
    },
    {
      code: "if (isNullish(foo)) {}",
    },
    {
      code: "const b: boolean = true; if (b) {}",
    },
    {
      code: "const b: boolean | undefined = undefined; if (b) {}",
    },
    {
      code: "const foo: boolean | null | undefined = null; if (foo) {}",
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
  ],
});
