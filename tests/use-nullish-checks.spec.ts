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
      code: "if (!!s) {}",
      filename,
      errors: [{ messageId: "nonNullish" }],
      output: "if (nonNullish(s)) {}",
    },
  ],
});
