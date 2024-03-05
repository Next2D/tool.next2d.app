import { execute } from "./TimelineToolLayerDeleteCreateHistoryObjectService";
import { $TIMELINE_TOOL_LAYER_DELETE_COMMAND } from "../../../../../../../config/HistoryConfig";
import { Layer } from "../../../../../../../core/domain/model/Layer";
import { MovieClip } from "../../../../../../../core/domain/model/MovieClip";

describe("TimelineToolLayerDeleteCreateHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const layer = new Layer();
        layer.name = "test_layer";

        const movieClip = new MovieClip({
            "id": 0,
            "name": "MovieClip_01",
            "type": "container"
        });

        const object = execute(1, movieClip, 9, layer);
        expect(object.command).toBe($TIMELINE_TOOL_LAYER_DELETE_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages.length).toBe(4);
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(movieClip.id);
        expect(object.messages[2]).toBe(9);
        expect(object.messages[3].name).toBe(layer.name);

        // 表示様の配列のチェック
        expect(object.args.length).toBe(2);
        expect(object.args[0]).toBe(movieClip.name);
        expect(object.args[1]).toBe(layer.name);
    });
});