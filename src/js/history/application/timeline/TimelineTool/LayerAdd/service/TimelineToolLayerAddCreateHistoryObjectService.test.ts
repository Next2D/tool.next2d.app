import { execute } from "./TimelineToolLayerAddCreateHistoryObjectService";
import { $TIMELINE_TOOL_LAYER_ADD_COMMAND } from "../../../../../../config/HistoryConfig";
import { Layer } from "../../../../../../core/domain/model/Layer";

describe("TimelineToolLayerAddCreateHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const layer = new Layer();
        layer.name = "test_layer";

        const object = execute(1, 0, layer, 10);
        expect(object.command).toBe($TIMELINE_TOOL_LAYER_ADD_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(0);
        expect(object.messages[2]).toBe(10);
        expect(object.messages[3]).toBe(layer.name);
        expect(object.messages[4]).toBe(layer.color);

        // 表示様の配列のチェック
        expect(object.args[0]).toBe(layer.name);
    });
});