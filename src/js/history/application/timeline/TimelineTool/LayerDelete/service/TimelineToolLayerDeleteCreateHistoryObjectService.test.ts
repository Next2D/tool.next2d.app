import { execute } from "./TimelineToolLayerDeleteCreateHistoryObjectService";
import { $TIMELINE_TOOL_LAYER_DELETE_COMMAND } from "../../../../../../config/HistoryConfig";
import { Layer } from "../../../../../../core/domain/model/Layer";

describe("TimelineToolLayerDeleteCreateHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const layer = new Layer();
        layer.name = "test_layer";

        const object = execute(1, 0, 9, layer);
        expect(object.command).toBe($TIMELINE_TOOL_LAYER_DELETE_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(0);
        expect(object.messages[2]).toBe(9);
        expect(object.messages[3].name).toBe(layer.name);
    });
});