import { RuleTester } from "@typescript-eslint/rule-tester";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- We are importing a JS module, so we cannot type this properly for now
const rule = require("../rules/no-relative-imports.cjs");

const ruleTester = new RuleTester();

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- We are importing a JS module, so we cannot type this properly for now
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
