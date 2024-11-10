import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../rules/use-nullish-checks";

const ruleTester = new RuleTester();

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
