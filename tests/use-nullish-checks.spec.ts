import { RuleTester } from "@typescript-eslint/rule-tester";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- We are importing a JS module, so we cannot type this properly for now
const rule = require("../rules/use-nullish-checks.cjs");

const ruleTester = new RuleTester();

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- We are importing a JS module, so we cannot type this properly for now
ruleTester.run("use-nullish-checks", rule, {
  valid: [
    {
      code: "isNullish(foo);",
    },
    {
      code: "nonNullish(bar);",
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
