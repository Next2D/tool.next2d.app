import { execute } from "./LibraryAreaAddNewBitmapCreateHistoryObjectService";
import { Bitmap } from "../../../../../../core/domain/model/Bitmap";
import { $LIBRARY_ADD_NEW_BITMAP_COMMAND } from "../../../../../../config/HistoryConfig";

describe("LibraryAreaAddNewBitmapCreateHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const bitmap = new Bitmap({
            "id": 10,
            "type": "bitmap",
            "name": "Bitmap_01"
        });
        const object = execute(1, 2, bitmap, "xyz");
        expect(object.command).toBe($LIBRARY_ADD_NEW_BITMAP_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages.length).toBe(4);
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(2);
        expect(object.messages[2].id).toBe(bitmap.id);
        expect(object.messages[3]).toBe("xyz");

        // 表示様の配列のチェック
        expect(object.args[0]).toBe(bitmap.name);
    });
});