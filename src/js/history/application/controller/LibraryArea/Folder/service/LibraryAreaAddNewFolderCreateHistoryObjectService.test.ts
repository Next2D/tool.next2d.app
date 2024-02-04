import { execute } from "./LibraryAreaAddNewFolderCreateHistoryObjectService";
import { $LIBRARY_ADD_NEW_FOLDER } from "../../../../../../config/HistoryConfig";

describe("LibraryAreaAddNewFolderCreateHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const object = execute(1, 2, "Folder", 10);
        expect(object.command).toBe($LIBRARY_ADD_NEW_FOLDER);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.args[0]).toBe(1);
        expect(object.args[1]).toBe(2);
        expect(object.args[2]).toBe("Folder");
        expect(object.args[3]).toBe(10);
    });
});