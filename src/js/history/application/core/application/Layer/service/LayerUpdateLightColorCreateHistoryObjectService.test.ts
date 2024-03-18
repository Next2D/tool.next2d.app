import { execute } from "./LayerUpdateLightColorCreateHistoryObjectService";
import { $LAYER_UPDATE_LIGHT_COLOR_COMMAND } from "../../../../../../config/HistoryConfig";
import { MovieClip } from "../../../../../../core/domain/model/MovieClip";

describe("LayerUpdateLightColorCreateHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const movieClip = new MovieClip({
            "id": 0,
            "type": "container",
            "name": "MovieClip_01"
        });

        const layer = movieClip.layers[0];

        const object = execute(1, movieClip, layer, "#990000");
        expect(object.command).toBe($LAYER_UPDATE_LIGHT_COLOR_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages.length).toBe(5);
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(movieClip.id);
        expect(object.messages[2]).toBe(0);
        expect(object.messages[3]).toBe("#990000");
        expect(object.messages[4]).toBe(layer.color);

        // 表示様の配列のチェック
        expect(object.args.length).toBe(1);
        expect(object.args[0]).toBe(layer.name);
    });
});