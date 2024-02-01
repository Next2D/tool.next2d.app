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
        expect(object.args[0]).toBe(1);
        expect(object.args[1]).toBe(0);
        expect(object.args[2]).toBe(10);
        expect(object.args[3]).toBe(beforeScript);
        expect(object.args[4]).toBe(afterScript);
    });
});