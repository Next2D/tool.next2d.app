import { execute } from "./CharacterCalcGetScaleXService";
import { describe, expect, it } from "vitest";

describe("CharacterCalcGetScaleXService Test", () =>
{
    it("test case", () =>
    {
        expect(execute([1.2, 0.3, -0.5, 1.2, 10, 20])).toBe(1.2369);
    });
});