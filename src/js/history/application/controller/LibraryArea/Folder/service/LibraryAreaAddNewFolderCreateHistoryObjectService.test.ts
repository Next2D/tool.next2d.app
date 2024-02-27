import { execute } from "./LibraryAreaAddNewFolderCreateHistoryObjectService";
import { $LIBRARY_ADD_NEW_FOLDER_COMMAND } from "../../../../../../config/HistoryConfig";

describe("LibraryAreaAddNewFolderCreateHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const object = execute(1, 2, 0, "Folder", 10);
        expect(object.command).toBe($LIBRARY_ADD_NEW_FOLDER_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages.length).toBe(5);
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(2);
        expect(object.messages[2]).toBe(0);
        expect(object.messages[3]).toBe("Folder");
        expect(object.messages[4]).toBe(10);

        // 表示様の配列のチェック
        expect(object.args.length).toBe(0);
    });
});