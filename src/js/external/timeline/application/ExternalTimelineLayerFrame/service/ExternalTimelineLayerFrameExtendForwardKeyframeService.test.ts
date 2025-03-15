import { execute } from "./ExternalTimelineLayerFrameExtendForwardKeyframeService";
import { Layer } from "../../../../../core/domain/model/Layer";
import { Character } from "../../../../../core/domain/model/Character";
import { EmptyCharacter } from "../../../../../core/domain/model/EmptyCharacter";
import { describe, expect, it } from "vitest";

describe("ExternalTimelineLayerFrameExtendForwardKeyframeServiceTest", () =>
{
    it("execute test case1", () =>
    {
        const layer = new Layer();

        const emptyCharacter = new EmptyCharacter();
        emptyCharacter.startFrame = 4;
        emptyCharacter.endFrame   = 10;
        layer.addEmptyCharacter(emptyCharacter);

        expect(emptyCharacter.startFrame).toBe(4);
        expect(emptyCharacter.endFrame).toBe(10);
        execute(layer, 4, 3);
        expect(emptyCharacter.startFrame).toBe(1);
        expect(emptyCharacter.endFrame).toBe(10);
    });

    it("execute test case2", () =>
    {
        const layer = new Layer();

        const character = new Character();
        character.startFrame = 4;
        character.endFrame   = 10;
        layer.addCharacter(character);

        expect(character.startFrame).toBe(4);
        expect(character.endFrame).toBe(10);
        execute(layer, 4, 3);
        expect(character.startFrame).toBe(1);
        expect(character.endFrame).toBe(10);
    });
});