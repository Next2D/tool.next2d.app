import { execute } from "./CharacterLoadService";
import { describe, expect, it } from "vitest";

describe("CharacterLoadService Test", () =>
{
    it("should load basic character properties from save object", () =>
    {
        const character = {
            libraryId: "",
            depth: 0,
            blendMode: "",
            startFrame: 0,
            endFrame: 0,
            name: "",
            matrix: { set: () => {} },
            colorTransform: { set: () => {} },
            referencePosition: { pivot: "", x: 0, y: 0 }
        };

        const saveObject = {
            libraryId: "lib-123",
            depth: 5,
            blendMode: "normal",
            startFrame: 1,
            endFrame: 10,
            name: "testCharacter"
        };

        execute(character as any, saveObject as any);

        expect(character.libraryId).toBe("lib-123");
        expect(character.depth).toBe(5);
        expect(character.blendMode).toBe("normal");
        expect(character.startFrame).toBe(1);
        expect(character.endFrame).toBe(10);
        expect(character.name).toBe("testCharacter");
    });

    it("should load optional parent IDs when present", () =>
    {
        const character = {
            libraryId: "",
            depth: 0,
            blendMode: "",
            startFrame: 0,
            endFrame: 0,
            name: "",
            parentMovieClipId: "",
            matrix: { set: () => {} },
            colorTransform: { set: () => {} },
            referencePosition: { pivot: "", x: 0, y: 0 }
        };

        const saveObject = {
            libraryId: "lib-123",
            depth: 5,
            blendMode: "normal",
            startFrame: 1,
            endFrame: 10,
            name: "testCharacter",
            parentMovieClipId: "parent-mc-id"
        };

        execute(character as any, saveObject as any);

        expect(character.parentMovieClipId).toBe("parent-mc-id");
    });

    it("should load referencePosition with pivot when present", () =>
    {
        const character = {
            libraryId: "",
            depth: 0,
            blendMode: "",
            startFrame: 0,
            endFrame: 0,
            name: "",
            matrix: { set: () => {} },
            colorTransform: { set: () => {} },
            referencePosition: { pivot: "", x: 0, y: 0 }
        };

        const saveObject = {
            libraryId: "lib-123",
            depth: 5,
            blendMode: "normal",
            startFrame: 1,
            endFrame: 10,
            name: "testCharacter",
            referencePosition: {
                pivot: "center",
                x: 0,
                y: 0
            }
        };

        execute(character as any, saveObject as any);

        expect(character.referencePosition.pivot).toBe("center");
    });

    it("should load referencePosition with x,y when pivot is none", () =>
    {
        const character = {
            libraryId: "",
            depth: 0,
            blendMode: "",
            startFrame: 0,
            endFrame: 0,
            name: "",
            matrix: { set: () => {} },
            colorTransform: { set: () => {} },
            referencePosition: { pivot: "", x: 0, y: 0 }
        };

        const saveObject = {
            libraryId: "lib-123",
            depth: 5,
            blendMode: "normal",
            startFrame: 1,
            endFrame: 10,
            name: "testCharacter",
            referencePosition: {
                pivot: "none",
                x: 50,
                y: 75
            }
        };

        execute(character as any, saveObject as any);

        expect(character.referencePosition.pivot).toBe("none");
        expect(character.referencePosition.x).toBe(50);
        expect(character.referencePosition.y).toBe(75);
    });
});
