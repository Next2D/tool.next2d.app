import { execute } from "./CharacterCalcSetRotationService";
import { describe, expect, it } from "vitest";

describe("CharacterCalcSetRotationService Test", () =>
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

        execute(10, 20, matrix);

        expect(matrix[0]).toBe(0.462091429048787);
        expect(matrix[1]).toBe(1.147375924097961);
        expect(matrix[2]).toBe(-0.5);
        expect(matrix[3]).toBe(-7.3880848441329166);
        expect(matrix[4]).toBe(6.845159043871334);
        expect(matrix[5]).toBe(20);
    });
});