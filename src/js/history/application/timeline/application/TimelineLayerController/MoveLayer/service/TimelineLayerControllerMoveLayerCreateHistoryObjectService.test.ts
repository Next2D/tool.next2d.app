import { execute } from "./TimelineLayerControllerMoveLayerCreateHistoryObjectService";
import { $TIMELINE_MOVE_LAYER_COMMAND } from "../../../../../../../config/HistoryConfig";
import { MovieClip } from "../../../../../../../core/domain/model/MovieClip";

describe("TimelineLayerControllerMoveLayerCreateHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const movieClip = new MovieClip({
            "id": 0,
            "type": "container",
            "name": "MovieClip_01"
        });

        const layer = movieClip.layers[0];

        const object = execute(1, movieClip, layer, 11, 1, 1, 2);
        expect(object.command).toBe($TIMELINE_MOVE_LAYER_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages.length).toBe(8);
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(0);
        expect(object.messages[2]).toBe(11);
        expect(object.messages[3]).toBe(1);
        expect(object.messages[4]).toBe(1);
        expect(object.messages[5]).toBe(0);
        expect(object.messages[6]).toBe(2);
        expect(object.messages[7]).toBe(-1);

        // 表示様の配列のチェック
        expect(object.args.length).toBe(2);
        expect(object.args[0]).toBe(movieClip.name);
        expect(object.args[1]).toBe(layer.name);
    });
});