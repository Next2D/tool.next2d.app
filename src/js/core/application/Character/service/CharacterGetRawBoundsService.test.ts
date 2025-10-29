import { execute } from "./CharacterGetRawBoundsService";
import { $MOVIE_CLIP_TYPE } from "@/config/InstanceConfig";
import { describe, expect, it } from "vitest";

describe("CharacterGetRawBoundsService Test", () =>
{
    it("should return null when library instance is not found", () =>
    {
        const workSpace = {
            getLibrary: () => null
        };
        
        const character = {
            libraryId: "test-id",
            startFrame: 1
        };

        const result = execute(workSpace as any, character as any, 1);

        expect(result).toBeNull();
    });

    it("should return raw bounds for non-MovieClip instance", () =>
    {
        const mockInstance = {
            type: "shape",
            getRawBounds: () => ({
                xMin: 0,
                yMin: 0,
                xMax: 50,
                yMax: 50
            })
        };

        const workSpace = {
            getLibrary: () => mockInstance
        };
        
        const character = {
            libraryId: "test-id",
            startFrame: 1
        };

        const result = execute(workSpace as any, character as any, 1);

        expect(result).not.toBeNull();
        expect(result?.xMin).toBe(0);
        expect(result?.xMax).toBe(50);
    });

    it("should return frame-adjusted bounds for MovieClip instance", () =>
    {
        const mockMovieClip = {
            type: $MOVIE_CLIP_TYPE,
            maxFrame: 10,
            getRawBounds: () => ({
                xMin: 0,
                yMin: 0,
                xMax: 100,
                yMax: 100
            })
        };

        const workSpace = {
            getLibrary: () => mockMovieClip
        };
        
        const character = {
            libraryId: "test-id",
            startFrame: 1
        };

        const result = execute(workSpace as any, character as any, 5);

        expect(result).not.toBeNull();
    });
});
