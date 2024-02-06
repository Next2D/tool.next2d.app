import { execute } from "./ExternalFolderStateCreateHistoryObjectServic";
import { $LIBRARY_FOLDER_STATE_COMMAND } from "../../../../../config/HistoryConfig";

describe("ExternalFolderStateCreateHistoryObjectServicTest", () =>
{
    test("execute test", () =>
    {
        const object = execute(1, 2, "open");
        expect(object.command).toBe($LIBRARY_FOLDER_STATE_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.args[0]).toBe(1);
        expect(object.args[1]).toBe(2);
        expect(object.args[2]).toBe("open");
    });
});