import { execute } from "./ExternalTimelineLayerFrameExtendBehindKeyframeService";
import { Layer } from "../../../../../core/domain/model/Layer";
import { Character } from "../../../../../core/domain/model/Character";
import { EmptyCharacter } from "../../../../../core/domain/model/EmptyCharacter";

describe("ExternalTimelineLayerFrameExtendBehindKeyframeServiceTest", () =>
{
    test("execute test case1", () =>
    {
        const layer = new Layer();

        const emptyCharacter = new EmptyCharacter();
        emptyCharacter.startFrame = 1;
        emptyCharacter.endFrame   = 5;
        layer.addEmptyCharacter(emptyCharacter);

        expect(emptyCharacter.startFrame).toBe(1);
        expect(emptyCharacter.endFrame).toBe(5);
        execute(layer, 4, 2);
        expect(emptyCharacter.startFrame).toBe(1);
        expect(emptyCharacter.endFrame).toBe(7);
    });

    test("execute test case2", () =>
    {
        const layer = new Layer();

        const character = new Character();
        character.startFrame = 1;
        character.endFrame   = 5;
        layer.addCharacter(character);

        expect(character.startFrame).toBe(1);
        expect(character.endFrame).toBe(5);
        execute(layer, 4, 2);
        expect(character.startFrame).toBe(1);
        expect(character.endFrame).toBe(7);
    });
});