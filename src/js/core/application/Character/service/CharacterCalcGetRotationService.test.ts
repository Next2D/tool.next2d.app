import { execute } from "./CharacterCalcGetRotationService";
import { describe, expect, it } from "vitest";

describe("CharacterCalcGetRotationService Test", () =>
{
    it("test case", () =>
    {
        expect(execute(new Float32Array([1.2, 0.3, -0.5, 1.2, 10, 20]))).toBe(14.036243467926479);
    });
});