import { execute } from "./CharacterCalcSetScaleXService";
import { describe, expect, it } from "vitest";

describe("CharacterCalcSetScaleXService Test", () =>
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

        expect(matrix[0]).toBe(1.9402850002906638);
        expect(matrix[1]).toBe(0.48507125007266594);
        expect(matrix[2]).toBe(-0.5);
        expect(matrix[3]).toBe(1.2);
        expect(matrix[4]).toBe(10);
        expect(matrix[5]).toBe(20);
    });
});