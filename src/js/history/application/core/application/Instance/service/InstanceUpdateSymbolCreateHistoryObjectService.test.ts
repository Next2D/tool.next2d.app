import { execute } from "./InstanceUpdateSymbolCreateHistoryObjectService";
import { $LIBRARY_UPDATE_INSTANCE_SYMBOL_COMMAND } from "../../../../../../config/HistoryConfig";
import { MovieClip } from "../../../../../../core/domain/model/MovieClip";
import { Bitmap } from "../../../../../../core/domain/model/Bitmap";

describe("InstanceUpdateSymbolCreateHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const movieClip = new MovieClip({
            "id": 0,
            "type": "container",
            "name": "MovieClip_01"
        });

        const bitmap = new Bitmap({
            "id": 1,
            "type": "bitmap",
            "name": "Bitmap_01",
            "symbol": "before name"
        });
        bitmap.symbol = "after name";

        const object = execute(1, movieClip, bitmap, "before name");
        expect(object.command).toBe($LIBRARY_UPDATE_INSTANCE_SYMBOL_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages.length).toBe(5);
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(movieClip.id);
        expect(object.messages[2]).toBe(bitmap.id);
        expect(object.messages[3]).toBe("before name");
        expect(object.messages[4]).toBe("after name");

        // 表示様の配列のチェック
        expect(object.args.length).toBe(2);
        expect(object.args[0]).toBe(bitmap.name);
        expect(object.args[1]).toBe("after name");
    });
});