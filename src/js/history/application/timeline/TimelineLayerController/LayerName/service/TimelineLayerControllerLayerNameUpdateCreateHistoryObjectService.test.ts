import { execute } from "./TimelineLayerControllerLayerNameUpdateCreateHistoryObjectService";
import { $LAYER_NAME_UPDATE_COMMAND } from "../../../../../../config/HistoryConfig";
import { Layer } from "../../../../../../core/domain/model/Layer";

describe("TimelineLayerControllerLayerNameUpdateCreateHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const layer = new Layer();
        layer.name = "test_layer";

        const object = execute(1, 0, 0, layer.name, "after_name");
        expect(object.command).toBe($LAYER_NAME_UPDATE_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(0);
        expect(object.messages[2]).toBe(0);
        expect(object.messages[3]).toBe(layer.name);
        expect(object.messages[4]).toBe("after_name");
    });
});