import { RuleTester } from "@typescript-eslint/rule-tester";
import { afterAll, it, describe } from "vitest";

// Assign vitest testing methods to RuleTester
// https://typescript-eslint.io/packages/rule-tester#vitest
RuleTester.afterAll = afterAll;
RuleTester.it = it;
RuleTester.itOnly = it.only;
RuleTester.describe = describe;
