import { execute } from "./CharacterCalcSetRotationService";
import { describe, expect, it } from "vitest";

describe("CharacterCalcSetRotationService Test", () =>
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

        execute(10, 20, matrix);

        expect(matrix[0]).toBe(1.2181400060653687);
        expect(matrix[1]).toBe(0.214790940284729);
        expect(matrix[2]).toBe(-0.41429486870765686);
        expect(matrix[3]).toBe(1.2322174310684204);
        expect(matrix[4]).toBe(10);
        expect(matrix[5]).toBe(20);
    });
});