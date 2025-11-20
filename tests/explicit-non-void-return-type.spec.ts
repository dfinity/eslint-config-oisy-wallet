import { RuleTester } from "@typescript-eslint/rule-tester";
const rule = require("../rules/explicit-non-void-return-type.cjs");

const ruleTester = new RuleTester();

ruleTester.run("explicit-non-void-return-type", rule, {
  valid: [
    // Test for implied void returns
    {
      code: "function foo(): {}",
    },
    {
      code: "const foo = function() {}",
    },
    {
      code: "const foo = () => {}",
    },
    {
      code: "async function bar() {}",
    },
    {
      code: "const bar = async function() {}",
    },
    {
      code: "const bar = async () => {}",
    },

    // Test for explicit non-void returns
    {
      code: "function foo(): number { return 42; }",
    },
    {
      code: "const foo = function(): string { return 'hello'; }",
    },
    {
      code: "const foo = (): boolean => true",
    },
    {
      code: "async function bar(): Promise<boolean> { return Promise.resolve(true); }",
    },
    {
      code: "const bar = async function(): Promise<number> { return Promise.resolve(42); }",
    },
    {
      code: "const bar = async (): Promise<string> => Promise.resolve('hello');",
    },

    // Test for explicit void returns
    {
      code: "function foo(): void {}",
    },
    {
      code: "const foo = function(): void {}",
    },
    {
      code: "const foo = (): void => {}",
    },
    {
      code: "async function bar(): Promise<void> {}",
    },
    {
      code: "const bar = async function(): Promise<void> {}",
    },
    {
      code: "const bar = async (): Promise<void> => {}",
    },
  ],

  invalid: [
    {
      code: "function foo() { return 42; }",
      errors: [{ messageId: "missingReturnType" }],
    },
    {
      code: 'const foo = function() { return "hello"; }',
      errors: [{ messageId: "missingReturnType" }],
    },
    {
      code: "const foo = () => { return true; }",
      errors: [{ messageId: "missingReturnType" }],
    },
    {
      code: "const bar = async function() { return 42; }",
      errors: [{ messageId: "missingReturnType" }],
    },
    {
      code: "async function bar() { return true; }",
      errors: [{ messageId: "missingReturnType" }],
    },
  ],
});
