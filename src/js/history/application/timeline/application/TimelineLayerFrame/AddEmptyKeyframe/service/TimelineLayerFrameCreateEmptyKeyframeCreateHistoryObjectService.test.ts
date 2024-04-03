import { execute } from "./TimelineLayerFrameCreateEmptyKeyframeCreateHistoryObjectService";
import { $TIMELINE_ADD_EMPTY_KEYFRAME_COMMAND } from "../../../../../../../config/HistoryConfig";
import { MovieClip } from "../../../../../../../core/domain/model/MovieClip";

describe("TimelineLayerFrameCreateEmptyKeyframeCreateHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const movieClip = new MovieClip({
            "id": 0,
            "type": "container",
            "name": "MovieClip_01"
        });

        const layer = movieClip.layers[0];

        const object = execute(1, movieClip, layer, 1, 2);
        expect(object.command).toBe($TIMELINE_ADD_EMPTY_KEYFRAME_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages.length).toBe(5);
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(0);
        expect(object.messages[2]).toBe(0);
        expect(object.messages[3]).toBe(1);
        expect(object.messages[4]).toBe(2);

        // 表示様の配列のチェック
        expect(object.args.length).toBe(3);
        expect(object.args[0]).toBe(movieClip.name);
        expect(object.args[1]).toBe(layer.name);
        expect(object.args[2]).toBe(1);
    });
});