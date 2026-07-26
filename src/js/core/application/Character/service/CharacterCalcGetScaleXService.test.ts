import { execute } from "./CharacterCalcGetScaleXService";
import { describe, expect, it } from "vitest";

describe("CharacterCalcGetScaleXService Test", () =>
{
    it("test case", () =>
    {
        expect(execute(new Float32Array([1.2, 0.3, -0.5, 1.2, 10, 20]))).toBe(1.24);
    });

    it("test case for rotation over 90 degrees", () =>
    {
        // 回転100度・スケール(1.5, 1)。回転角に由来する符号は付与しない
        const radian = 100 * Math.PI / 180;
        const matrix = new Float32Array([
            1.5 * Math.cos(radian), 1.5 * Math.sin(radian),
            -1 * Math.sin(radian), 1 * Math.cos(radian),
            0, 0
        ]);

        expect(execute(matrix)).toBe(1.5);
    });
});
