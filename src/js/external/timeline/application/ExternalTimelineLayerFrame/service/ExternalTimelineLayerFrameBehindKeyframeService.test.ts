import { execute } from "./ExternalTimelineLayerFrameBehindKeyframeService";
import { Layer } from "../../../../../core/domain/model/Layer";
import { EmptyCharacter } from "../../../../../core/domain/model/EmptyCharacter";

describe("ExternalTimelineLayerFrameBehindKeyframeServiceTest", () =>
{
    test("execute test case1", () =>
    {
        const layer = new Layer();

        const frames = [
            {
                "startFrame": 1,
                "endFrame": 2
            },
            {
                "startFrame": 2,
                "endFrame": 4
            },
            {
                "startFrame": 4,
                "endFrame": 6
            },
            {
                "startFrame": 6,
                "endFrame": 8
            }
        ];
        for (let idx = 0; idx < 4; ++idx) {
            const emptyCharacter = new EmptyCharacter();
            const frameObject = frames[idx];
            emptyCharacter.startFrame = frameObject.startFrame;
            emptyCharacter.endFrame   = frameObject.endFrame;
            layer.addEmptyCharacter(emptyCharacter);
        }

        const numFrame = 10;
        execute(layer, frames[1].endFrame, numFrame);
        expect(layer.emptyCharacters[0].startFrame).toBe(frames[0].startFrame);
        expect(layer.emptyCharacters[0].endFrame).toBe(frames[0].endFrame);
        expect(layer.emptyCharacters[1].startFrame).toBe(frames[1].startFrame);
        expect(layer.emptyCharacters[1].endFrame).toBe(frames[1].endFrame);
        expect(layer.emptyCharacters[2].startFrame).toBe(frames[2].startFrame + numFrame);
        expect(layer.emptyCharacters[2].endFrame).toBe(frames[2].endFrame + numFrame);
        expect(layer.emptyCharacters[3].startFrame).toBe(frames[3].startFrame + numFrame);
        expect(layer.emptyCharacters[3].endFrame).toBe(frames[3].endFrame + numFrame);
    });

    test("execute test case2", () =>
    {
        const layer = new Layer();

        const emptyCharacter = new EmptyCharacter();
        emptyCharacter.startFrame = 1;
        emptyCharacter.endFrame   = 2;
        layer.addEmptyCharacter(emptyCharacter);

        execute(layer, 1, 1);
        expect(emptyCharacter.startFrame).toBe(2);
        expect(emptyCharacter.endFrame).toBe(3);
    });

    test("execute test case2", () =>
    {
        const layer = new Layer();

        const emptyCharacter1 = new EmptyCharacter();
        emptyCharacter1.startFrame = 1;
        emptyCharacter1.endFrame   = 2;
        layer.addEmptyCharacter(emptyCharacter1);

        const emptyCharacter2 = new EmptyCharacter();
        emptyCharacter2.startFrame = 2;
        emptyCharacter2.endFrame   = 3;
        layer.addEmptyCharacter(emptyCharacter2);

        execute(layer, 1, 1);
        expect(emptyCharacter1.startFrame).toBe(2);
        expect(emptyCharacter1.endFrame).toBe(3);
        expect(emptyCharacter2.startFrame).toBe(3);
        expect(emptyCharacter2.endFrame).toBe(4);
    });
});