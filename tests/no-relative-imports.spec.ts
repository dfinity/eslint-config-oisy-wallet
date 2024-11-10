import { RuleTester } from "@typescript-eslint/rule-tester";

const rule = require("../rules/no-relative-imports.cjs");

const ruleTester = new RuleTester();

ruleTester.run("no-relative-imports", rule, {
  valid: [
    {
      code: 'import moduleA from "moduleA";',
    },
    {
      code: 'import { something } from "@alias/something";',
    },
  ],

  invalid: [
    {
      code: 'import moduleB from "./moduleB";',
      errors: [{ messageId: "noRelativeImports" }],
    },
    {
      code: 'import moduleC from "./path/moduleC";',
      errors: [{ messageId: "noRelativeImports" }],
    },
  ],
});
