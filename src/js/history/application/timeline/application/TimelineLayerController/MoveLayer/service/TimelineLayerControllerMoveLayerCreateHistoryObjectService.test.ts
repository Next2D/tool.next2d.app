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

        const object = execute(1, movieClip, 0, 1, "layer_name");
        expect(object.command).toBe($TIMELINE_MOVE_LAYER_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages.length).toBe(4);
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(0);
        expect(object.messages[2]).toBe(0);
        expect(object.messages[3]).toBe(1);

        // 表示様の配列のチェック
        expect(object.args.length).toBe(1);
        expect(object.args[0]).toBe("layer_name");
    });
});