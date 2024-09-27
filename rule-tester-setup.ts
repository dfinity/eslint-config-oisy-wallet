import { RuleTester } from "@typescript-eslint/rule-tester";
import * as vitest from "vitest";

// Assign vitest testing methods to RuleTester
// https://typescript-eslint.io/packages/rule-tester#vitest
RuleTester.afterAll = vitest.afterAll;
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;
