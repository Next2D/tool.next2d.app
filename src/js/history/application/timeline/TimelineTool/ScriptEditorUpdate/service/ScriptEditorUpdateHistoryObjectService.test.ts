import { execute } from "./ScriptEditorUpdateHistoryObjectService";
import { $TIMIELINE_TOOL_SCRIPT_UPDATE_COMMAND } from "../../../../../../config/HistoryConfig";

describe("ScriptEditorUpdateHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const beforeScript = "var a = \"test a\";";
        const afterScript  = "var b = \"test b\";";
        const object = execute(1, 0, 10, beforeScript, afterScript);
        expect(object.command).toBe($TIMIELINE_TOOL_SCRIPT_UPDATE_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(0);
        expect(object.messages[2]).toBe(10);
        expect(object.messages[3]).toBe(beforeScript);
        expect(object.messages[4]).toBe(afterScript);

        // 表示様の配列のチェック
        expect(object.args[0]).toBe(10);
    });
});