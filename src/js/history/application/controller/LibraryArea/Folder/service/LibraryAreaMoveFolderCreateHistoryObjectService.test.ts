import { execute } from "./LibraryAreaMoveFolderCreateHistoryObjectService";
import { $LIBRARY_MOVE_FOLDER_COMMAND } from "../../../../../../config/HistoryConfig";

describe("LibraryAreaMoveFolderCreateHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const object = execute(1, 2, 0, 4, 0);
        expect(object.command).toBe($LIBRARY_MOVE_FOLDER_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.args[0]).toBe(1);
        expect(object.args[1]).toBe(2);
        expect(object.args[2]).toBe(0);
        expect(object.args[3]).toBe(4);
        expect(object.args[4]).toBe(0);
    });
});