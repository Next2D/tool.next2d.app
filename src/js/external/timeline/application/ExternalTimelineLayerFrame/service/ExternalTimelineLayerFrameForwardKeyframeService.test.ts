import { execute } from "./ExternalTimelineLayerFrameForwardKeyframeService";
import { Layer } from "../../../../../core/domain/model/Layer";
import { EmptyCharacter } from "../../../../../core/domain/model/EmptyCharacter";

describe("ExternalTimelineLayerFrameForwardKeyframeServiceTest", () =>
{
    test("execute test", () =>
    {
        const layer = new Layer();

        const frames = [
            {
                "startFrame": 1,
                "endFrame": 2
            },
            {
                "startFrame": 2,
                "endFrame": 6
            },
            {
                "startFrame": 6,
                "endFrame": 8
            },
            {
                "startFrame": 8,
                "endFrame": 10
            }
        ];
        for (let idx = 0; idx < 4; ++idx) {
            const emptyCharacter = new EmptyCharacter();
            const frameObject = frames[idx];
            emptyCharacter.startFrame = frameObject.startFrame;
            emptyCharacter.endFrame   = frameObject.endFrame;
            layer.addEmptyCharacter(emptyCharacter);
        }

        const numFrame = 3;
        execute(layer, frames[1].endFrame, 3);
        expect(layer.emptyCharacters[0].startFrame).toBe(frames[0].startFrame);
        expect(layer.emptyCharacters[0].endFrame).toBe(frames[0].endFrame);
        expect(layer.emptyCharacters[1].startFrame).toBe(frames[1].startFrame);
        expect(layer.emptyCharacters[1].endFrame).toBe(frames[1].endFrame);
        expect(layer.emptyCharacters[2].startFrame).toBe(frames[2].startFrame - numFrame);
        expect(layer.emptyCharacters[2].endFrame).toBe(frames[2].endFrame - numFrame);
        expect(layer.emptyCharacters[3].startFrame).toBe(frames[3].startFrame - numFrame);
        expect(layer.emptyCharacters[3].endFrame).toBe(frames[3].endFrame - numFrame);
    });
});