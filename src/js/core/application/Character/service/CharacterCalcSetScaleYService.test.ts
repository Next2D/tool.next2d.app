import { execute } from "./CharacterCalcSetScaleYService";
import { describe, expect, it } from "vitest";

describe("CharacterCalcSetScaleYService Test", () =>
{
    it("test case", () =>
    {
        const matrix = [1.2, 0.3, -0.5, 1.2, 10, 20];

        expect(matrix[0]).toBe(1.2);
        expect(matrix[1]).toBe(0.3);
        expect(matrix[2]).toBe(-0.5);
        expect(matrix[3]).toBe(1.2);
        expect(matrix[4]).toBe(10);
        expect(matrix[5]).toBe(20);

        execute(2, 1.2, matrix);

        expect(matrix[0]).toBe(1.2);
        expect(matrix[1]).toBe(0.3);
        expect(matrix[2]).toBe(-0.5);
        expect(matrix[3]).toBe(0.23829044123686127);
        expect(matrix[4]).toBe(1.9857536769738442);
        expect(matrix[5]).toBe(20);
    });
});