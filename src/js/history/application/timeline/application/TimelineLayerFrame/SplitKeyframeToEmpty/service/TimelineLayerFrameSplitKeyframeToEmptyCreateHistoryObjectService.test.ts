import { execute } from "./TimelineLayerFrameSplitKeyframeToEmptyCreateHistoryObjectService";
import { $TIMELINE_SPLIT_KEYFRAME_TO_EMPTY_COMMAND } from "../../../../../../../config/HistoryConfig";
import { MovieClip } from "../../../../../../../core/domain/model/MovieClip";
import { EmptyCharacter } from "../../../../../../../core/domain/model/EmptyCharacter";

describe("TimelineLayerFrameSplitKeyframeToEmptyCreateHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const movieClip = new MovieClip({
            "id": 0,
            "type": "container",
            "name": "MovieClip_01"
        });

        const layer = movieClip.layers[0];

        const emptyCharacter = new EmptyCharacter();
        emptyCharacter.startFrame = 1;
        emptyCharacter.endFrame   = 4;
        layer.addEmptyCharacter(emptyCharacter);

        const object = execute(1, movieClip, layer, emptyCharacter, 2, 1);
        expect(object.command).toBe($TIMELINE_SPLIT_KEYFRAME_TO_EMPTY_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages.length).toBe(6);
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(0);
        expect(object.messages[2]).toBe(0);
        expect(object.messages[3]).toBe(0);
        expect(object.messages[4]).toBe(2);
        expect(object.messages[5]).toBe(1);

        // 表示様の配列のチェック
        expect(object.args.length).toBe(3);
        expect(object.args[0]).toBe(movieClip.name);
        expect(object.args[1]).toBe(layer.name);
        expect(object.args[2]).toBe(1);
    });
});