import { execute } from "./CharacterCalcGetScaleYService";
import { describe, expect, it } from "vitest";

describe("CharacterCalcGetScaleYService Test", () =>
{
    it("test case", () =>
    {
        // y基底ベクトルの長さ hypot(-0.51, 1.234) を返却する
        expect(execute(new Float32Array([1.2, 0.3, -0.51, 1.234, 10, 20]))).toBe(1.34);
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

        expect(execute(matrix)).toBe(1);
    });

    it("test case for flipped matrix", () =>
    {
        // y基底を180度回した反転状態は、行列式が負になるので負の値を返却する
        expect(execute(new Float32Array([1, 0, 0, -1, 0, 0]))).toBe(-1);
    });
});
