import { RuleTester } from "@typescript-eslint/rule-tester";
import * as path from "path";
const rule = require("../rules/use-nullish-checks.cjs");

const ruleTester = new RuleTester({
  languageOptions: {
    parser: require("@typescript-eslint/parser"),
  },
});

const filename = path.join(__dirname, "..", "rule-test-file.ts");

ruleTester.run("use-nullish-checks", rule, {
  valid: [
    {
      code: "isNullish(foo);",
      filename,
    },
    {
      code: "nonNullish(bar);",
      filename,
    },
    {
      code: "if (a === b) {}",
      filename,
    },
    {
      code: "if (a !== b) {}",
      filename,
    },
    {
      code: "if (a > b) {}",
      filename,
    },
    {
      code: "if (a < b) {}",
      filename,
    },
    {
      code: "if (!nonNullish(foo)) {}",
      filename,
    },
    {
      code: "if (isNullish(foo)) {}",
      filename,
    },
    {
      code: "if (a === b) {}",
      options: [{ includeBooleans: false }],
      filename,
    },
    {
      code: "const b: boolean = true; if (b) {}",
      filename,
    },
    {
      code: "const b: boolean = true; if (b) {}",
      options: [{ includeBooleans: false }],
      filename,
    },
    {
      code: "const b: boolean | undefined = undefined; if (b) {}",
      filename,
    },
    {
      code: "const foo: boolean | null | undefined = null; if (foo) {}",
      filename,
    },
    {
      code: "if (a === b) {}",
      filename,
    },
    {
      code: "if (a !== b) {}",
      filename,
    },
    {
      code: "if (a > b) {}",
      filename,
    },
    {
      code: "if (a < b) {}",
      filename,
    },
    {
      code: "if (!nonNullish(foo)) {}",
      filename,
    },
    {
      code: "if (isNullish(foo)) {}",
      filename,
    },
    {
      code: "const b: boolean = true; if (b) {}",
      filename,
    },
    {
      code: "const b: boolean | undefined = undefined; if (b) {}",
      filename,
    },
    {
      code: "const foo: boolean | null | undefined = null; if (foo) {}",
      filename,
    },
  ],

  invalid: [
    {
      code: "foo === null;",
      filename,
      errors: [{ messageId: "isNullish" }],
      output: "isNullish(foo);",
    },
    {
      code: "foo !== undefined;",
      filename,
      errors: [{ messageId: "nonNullish" }],
      output: "nonNullish(foo);",
    },
    {
      code: "foo == null;",
      filename,
      errors: [{ messageId: "isNullish" }],
      output: "isNullish(foo);",
    },
    {
      code: "foo != undefined;",
      filename,
      errors: [{ messageId: "nonNullish" }],
      output: "nonNullish(foo);",
    },
    {
      code: "const foo: string | undefined = undefined; if (foo) {}",
      filename,
      errors: [{ messageId: "nonNullish" }],
      output:
        "const foo: string | undefined = undefined; if (nonNullish(foo)) {}",
    },
    {
      code: "const foo: string | undefined = undefined; if (!foo) {}",
      filename,
      errors: [{ messageId: "isNullish" }],
      output:
        "const foo: string | undefined = undefined; if (isNullish(foo)) {}",
    },
    {
      code: "const foo: number | undefined = undefined; const bar = foo ? 1 : 2;",
      filename,
      errors: [{ messageId: "nonNullish" }],
      output:
        "const foo: number | undefined = undefined; const bar = nonNullish(foo) ? 1 : 2;",
    },
    {
      code: "if (s && n) {}",
      filename,
      errors: [{ messageId: "nonNullish" }, { messageId: "nonNullish" }],
      output: "if (nonNullish(s) && nonNullish(n)) {}",
    },
    {
      code: "if (a || b) {}",
      filename,
      errors: [{ messageId: "nonNullish" }, { messageId: "nonNullish" }],
      output: "if (nonNullish(a) || nonNullish(b)) {}",
    },
    {
      code: "if (!!s) {}",
      filename,
      errors: [{ messageId: "nonNullish" }],
      output: "if (nonNullish(s)) {}",
    },
    {
      code: "if (a === b) {}",
      options: [{ includeBooleans: true }],
      filename,
      errors: [{ messageId: "nonNullish" }],
      output: "if (nonNullish(a === b)) {}",
    },
    {
      code: "if (!(a === b)) {}",
      options: [{ includeBooleans: true }],
      filename,
      errors: [{ messageId: "isNullish" }],
      output: "if (isNullish(a === b)) {}",
    },
    {
      code: "const b: boolean = true; if (b) {}",
      options: [{ includeBooleans: true }],
      filename,
      errors: [{ messageId: "nonNullish" }],
      output: "const b: boolean = true; if (nonNullish(b)) {}",
    },
    {
      code: "const b: boolean | undefined = undefined; if (b) {}",
      options: [{ includeBooleans: true }],
      filename,
      errors: [{ messageId: "nonNullish" }],
      output: "const b: boolean | undefined = undefined; if (nonNullish(b)) {}",
    },
    {
      code: "const foo: boolean | null | undefined = null; if (!foo) {}",
      options: [{ includeBooleans: true }],
      filename,
      errors: [{ messageId: "isNullish" }],
      output:
        "const foo: boolean | null | undefined = null; if (isNullish(foo)) {}",
    },
    {
      code: "const x = foo ? (bar ? 1 : 2) : 3;",
      filename,
      errors: [{ messageId: "nonNullish" }, { messageId: "nonNullish" }],
      output: "const x = nonNullish(foo) ? (nonNullish(bar) ? 1 : 2) : 3;",
    },
    {
      code: "while (foo) {}",
      filename,
      errors: [{ messageId: "nonNullish" }],
      output: "while (nonNullish(foo)) {}",
    },
    {
      code: "do {} while (foo);",
      filename,
      errors: [{ messageId: "nonNullish" }],
      output: "do {} while (nonNullish(foo));",
    },
    {
      code: "for (; foo; ) {}",
      filename,
      errors: [{ messageId: "nonNullish" }],
      output: "for (; nonNullish(foo); ) {}",
    },
  ],
});
