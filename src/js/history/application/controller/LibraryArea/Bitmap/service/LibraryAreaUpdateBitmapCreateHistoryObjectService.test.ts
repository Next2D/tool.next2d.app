import { execute } from "./LibraryAreaUpdateBitmapCreateHistoryObjectService";
import { Bitmap } from "../../../../../../core/domain/model/Bitmap";
import { $LIBRARY_OVERWRITE_IMAGE_COMMAND } from "../../../../../../config/HistoryConfig";

describe("LibraryAreaUpdateBitmapCreateHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const bitmap = new Bitmap({
            "id": 10,
            "type": "bitmap",
            "name": "Bitmap_01",
            "imageType": "before"
        });

        const beforeObject = bitmap.toObject();

        bitmap.imageType = "after";
        const afterObject = bitmap.toObject();

        const object = execute(1, 2, beforeObject, afterObject, "xyz");
        expect(object.command).toBe($LIBRARY_OVERWRITE_IMAGE_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages.length).toBe(5);
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(2);
        expect(object.messages[2].imageType).toBe("before");
        expect(object.messages[3].imageType).toBe("after");
        expect(object.messages[4]).toBe("xyz");

        // 表示様の配列のチェック
        expect(object.args.length).toBe(1);
        expect(object.args[0]).toBe(bitmap.name);
    });
});