import { execute } from "./CharacterCalcSetScaleYUseCase";
import { describe, expect, it } from "vitest";

describe("CharacterCalcSetScaleYService Test", () =>
{
    it("test case", () =>
    {
        const matrix = new Float32Array([1.2, 0.3, -0.5, 1.2, 10, 20]);

        expect(matrix[0]).toBe(1.2000000476837158);
        expect(matrix[1]).toBe(0.30000001192092896);
        expect(matrix[2]).toBe(-0.5);
        expect(matrix[3]).toBe(1.2000000476837158);
        expect(matrix[4]).toBe(10);
        expect(matrix[5]).toBe(20);

        execute(2, matrix);

        // x基底は変化させず、y基底は向きを維持したまま長さだけを 1.3 から 2 に更新する
        expect(matrix[0]).toBe(1.2000000476837158);
        expect(matrix[1]).toBe(0.30000001192092896);
        expect(matrix[2]).toBe(-0.7692307233810425);
        expect(matrix[3]).toBe(1.8461538553237915);
        expect(matrix[4]).toBe(10);
        expect(matrix[5]).toBe(20);
    });

    it("test case for flip and unflip", () =>
    {
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);

        // 負の値を指定すると反転する(行列式が負になる)
        execute(-1, matrix);
        expect(matrix[0] * matrix[3] - matrix[1] * matrix[2]).toBe(-1);

        // 反転状態から正の値を指定すると反転が戻る
        execute(1, matrix);
        expect(matrix[0] * matrix[3] - matrix[1] * matrix[2]).toBe(1);
    });

    it("test case for flipped matrix with rotation", () =>
    {
        // 回転45度・y基底を180度回した反転状態
        const radian = 45 * Math.PI / 180;
        const matrix = new Float32Array([
            Math.cos(radian), Math.sin(radian),
            Math.sin(radian), -Math.cos(radian),
            0, 0
        ]);

        expect(matrix[0] * matrix[3] - matrix[1] * matrix[2]).toBeCloseTo(-1, 5);

        // 反転を維持したまま長さだけが2になる
        execute(-2, matrix);
        expect(Math.hypot(matrix[2], matrix[3])).toBeCloseTo(2, 5);
        expect(matrix[0] * matrix[3] - matrix[1] * matrix[2]).toBeCloseTo(-2, 5);

        // 正の値を指定すると反転が戻る
        execute(2, matrix);
        expect(Math.hypot(matrix[2], matrix[3])).toBeCloseTo(2, 5);
        expect(matrix[0] * matrix[3] - matrix[1] * matrix[2]).toBeCloseTo(2, 5);
    });
});
