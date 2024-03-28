import { execute } from "./TimelineToolLayerAddCreateHistoryObjectService";
import { $TIMELINE_TOOL_LAYER_ADD_COMMAND } from "../../../../../../../config/HistoryConfig";
import { Layer } from "../../../../../../../core/domain/model/Layer";
import { MovieClip } from "../../../../../../../core/domain/model/MovieClip";

describe("TimelineToolLayerAddCreateHistoryObjectServiceTest", () =>
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

        const object = execute(1, movieClip, layer, 10);
        expect(object.command).toBe($TIMELINE_TOOL_LAYER_ADD_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages.length).toBe(6);
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(0);
        expect(object.messages[2]).toBe(10);
        expect(object.messages[3]).toBe(layer.id);
        expect(object.messages[4]).toBe(layer.name);
        expect(object.messages[5]).toBe(layer.color);

        // 表示様の配列のチェック
        expect(object.args.length).toBe(2);
        expect(object.args[0]).toBe(movieClip.name);
        expect(object.args[1]).toBe(layer.name);
    });
});