import { execute } from "./ExternalFolderStateCreateHistoryObjectServic";
import { $LIBRARY_FOLDER_STATE_COMMAND } from "../../../../../config/HistoryConfig";
import { describe, expect, it } from "vitest";

describe("ExternalFolderStateCreateHistoryObjectServicTest", () =>
{
    it("execute test", () =>
    {
        const object = execute(1, 2, "open");
        expect(object.command).toBe($LIBRARY_FOLDER_STATE_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(2);
        expect(object.messages[2]).toBe("open");
    });
});