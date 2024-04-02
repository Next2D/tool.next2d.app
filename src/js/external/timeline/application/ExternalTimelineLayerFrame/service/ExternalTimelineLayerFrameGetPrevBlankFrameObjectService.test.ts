import { execute } from "./ExternalTimelineLayerFrameGetPrevBlankFrameObjectService";
import { Layer } from "../../../../../core/domain/model/Layer";
import { EmptyCharacter } from "../../../../../core/domain/model/EmptyCharacter";
import { Character } from "../../../../../core/domain/model/Character";

describe("ExternalTimelineLayerFrameGetPrevBlankFrameObjectServiceTest", () =>
{
    test("execute test case1", () =>
    {
        const layer = new Layer();
        const frameObject = execute(layer, 10);

        // 何もない状態の結果をチェック
        expect(frameObject.start).toBe(1);
        expect(frameObject.end).toBe(10);
    });

    test("execute test case2", () =>
    {
        const layer = new Layer();
        const emptyCharacter = new EmptyCharacter();
        emptyCharacter.startFrame = 1;
        emptyCharacter.endFrame = 4;
        layer.addEmptyCharacter(emptyCharacter);

        const frameObject = execute(layer, 10);

        // 表示様の配列のチェック
        expect(frameObject.start).toBe(emptyCharacter.endFrame);
        expect(frameObject.end).toBe(10);
    });

    test("execute test case3", () =>
    {
        const layer = new Layer();

        const frames = [1, 4, 7];
        for (let idx = 0; idx < 3; ++idx) {
            const emptyCharacter = new EmptyCharacter();
            emptyCharacter.startFrame = frames[idx];
            emptyCharacter.endFrame = frames[idx] + 3;
            layer.addEmptyCharacter(emptyCharacter);
        }

        const frameObject = execute(layer, 15);

        // 表示様の配列のチェック
        expect(frameObject.start).toBe(10);
        expect(frameObject.end).toBe(15);
    });

    test("execute test case4", () =>
    {
        const layer = new Layer();

        const frames = [1, 4, 7];
        for (let idx = 0; idx < 3; ++idx) {
            const character = new Character();
            character.startFrame = frames[idx];
            character.endFrame = frames[idx] + 3;
            layer.addCharacter(character);
        }

        const frameObject = execute(layer, 15);

        // 表示様の配列のチェック
        expect(frameObject.start).toBe(10);
        expect(frameObject.end).toBe(15);
    });

    test("execute test case5", () =>
    {
        const layer = new Layer();

        const character = new Character();
        character.startFrame = 3;
        character.endFrame = 4;
        layer.addCharacter(character);

        const emptyCharacter = new EmptyCharacter();
        emptyCharacter.startFrame = 1;
        emptyCharacter.endFrame = 3;
        layer.addEmptyCharacter(emptyCharacter);

        const frameObject = execute(layer, 10);

        // 表示様の配列のチェック
        expect(frameObject.start).toBe(character.endFrame);
        expect(frameObject.end).toBe(10);
    });

    test("execute test case6", () =>
    {
        const layer = new Layer();

        const character = new Character();
        character.startFrame = 1;
        character.endFrame = 3;
        layer.addCharacter(character);

        const emptyCharacter = new EmptyCharacter();
        emptyCharacter.startFrame = 3;
        emptyCharacter.endFrame = 4;
        layer.addEmptyCharacter(emptyCharacter);

        const frameObject = execute(layer, 10);

        // 表示様の配列のチェック
        expect(frameObject.start).toBe(emptyCharacter.endFrame);
        expect(frameObject.end).toBe(10);
    });

    test("execute test case7", () =>
    {
        const layer = new Layer();
        const character = new Character();
        character.startFrame = 1;
        character.endFrame = 4;
        layer.addCharacter(character);

        const frameObject = execute(layer, 10);

        // 表示様の配列のチェック
        expect(frameObject.start).toBe(character.endFrame);
        expect(frameObject.end).toBe(10);
    });
});