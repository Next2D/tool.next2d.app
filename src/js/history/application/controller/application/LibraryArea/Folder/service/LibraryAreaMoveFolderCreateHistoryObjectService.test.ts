import { execute } from "./LibraryAreaMoveFolderCreateHistoryObjectService";
import { $LIBRARY_MOVE_FOLDER_COMMAND } from "../../../../../../../config/HistoryConfig";

describe("LibraryAreaMoveFolderCreateHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const object = execute(1, 2, 0, 4, 0, "test");
        expect(object.command).toBe($LIBRARY_MOVE_FOLDER_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages.length).toBe(5);
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(2);
        expect(object.messages[2]).toBe(0);
        expect(object.messages[3]).toBe(4);
        expect(object.messages[4]).toBe(0);

        // 表示様の配列のチェック
        expect(object.args.length).toBe(1);
        expect(object.args[0]).toBe("test");
    });
});