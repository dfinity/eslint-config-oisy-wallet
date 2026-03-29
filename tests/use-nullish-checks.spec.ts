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
      code: "foo == null;",
      errors: [{ messageId: "isNullish" }],
      output: "isNullish(foo);",
    },
    {
      code: "foo != undefined;",
      errors: [{ messageId: "nonNullish" }],
      output: "nonNullish(foo);",
    },
    {
      code: "if (foo) {}",
      errors: [{ messageId: "nonNullish" }],
      output: "if (nonNullish(foo)) {}",
    },
    {
      code: "if (!foo) {}",
      errors: [{ messageId: "isNullish" }],
      output: "if (isNullish(foo)) {}",
    },
    {
      code: "const bar = foo ? 1 : 2;",
      errors: [{ messageId: "nonNullish" }],
      output: "const bar = nonNullish(foo) ? 1 : 2;",
    },
    {
      code: "if (s && n) {}",
      errors: [{ messageId: "nonNullish" }, { messageId: "nonNullish" }],
      output: "if (nonNullish(s) && nonNullish(n)) {}",
    },
    {
      code: "if (a || b) {}",
      errors: [{ messageId: "nonNullish" }, { messageId: "nonNullish" }],
      output: "if (nonNullish(a) || nonNullish(b)) {}",
    },
    {
      code: "if (!!s) {}",
      errors: [{ messageId: "nonNullish" }],
      output: "if (nonNullish(s)) {}",
    },
    {
      code: "if (a === b) {}",
      options: [{ includeBooleans: true }],
      errors: [{ messageId: "nonNullish" }],
      output: "if (nonNullish(a === b)) {}",
    },
    {
      code: "const x = foo ? (bar ? 1 : 2) : 3;",
      errors: [{ messageId: "nonNullish" }, { messageId: "nonNullish" }],
      output: "const x = nonNullish(foo) ? (nonNullish(bar) ? 1 : 2) : 3;",
    },
    {
      code: "while (foo) {}",
      errors: [{ messageId: "nonNullish" }],
      output: "while (nonNullish(foo)) {}",
    },
    {
      code: "do {} while (foo);",
      errors: [{ messageId: "nonNullish" }],
      output: "do {} while (nonNullish(foo));",
    },
    {
      code: "for (; foo; ) {}",
      errors: [{ messageId: "nonNullish" }],
      output: "for (; nonNullish(foo); ) {}",
    },
  ],
});
