import { execute } from "./CharacterGetBoundsService";
import { describe, expect, it } from "vitest";

describe("CharacterGetBoundsService Test", () =>
{
    it("should return null when character has no raw bounds", () =>
    {
        const character = {
            getRawBounds: () => null,
            matrix: new Float32Array([1, 0, 0, 1, 0, 0])
        };

        const result = execute(character as any, 1, false);

        expect(result).toBeNull();
    });

    it("should return bounds with character matrix applied", () =>
    {
        const character = {
            getRawBounds: () => ({
                xMin: 0,
                yMin: 0,
                xMax: 100,
                yMax: 100
            }),
            matrix: new Float32Array([1, 0, 0, 1, 10, 20])
        };

        const result = execute(character as any, 1, false);

        expect(result).not.toBeNull();
    });
});
