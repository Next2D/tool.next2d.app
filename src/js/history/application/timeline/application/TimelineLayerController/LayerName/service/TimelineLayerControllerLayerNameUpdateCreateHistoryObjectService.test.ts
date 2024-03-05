import { execute } from "./TimelineLayerControllerLayerNameUpdateCreateHistoryObjectService";
import { $LAYER_NAME_UPDATE_COMMAND } from "../../../../../../../config/HistoryConfig";
import { Layer } from "../../../../../../../core/domain/model/Layer";
import { MovieClip } from "../../../../../../../core/domain/model/MovieClip";

describe("TimelineLayerControllerLayerNameUpdateCreateHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const layer = new Layer();
        layer.name = "test_layer";

        const movieClip = new MovieClip({
            "id": 0,
            "type": "container",
            "name": "MovieClip_01"
        });

        const object = execute(1, movieClip, 0, layer.name, "after_name");
        expect(object.command).toBe($LAYER_NAME_UPDATE_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages.length).toBe(5);
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(0);
        expect(object.messages[2]).toBe(0);
        expect(object.messages[3]).toBe(layer.name);
        expect(object.messages[4]).toBe("after_name");

        // 表示様の配列のチェック
        expect(object.args.length).toBe(3);
        expect(object.args[0]).toBe(movieClip.name);
        expect(object.args[1]).toBe(layer.name);
        expect(object.args[2]).toBe("after_name");
    });
});