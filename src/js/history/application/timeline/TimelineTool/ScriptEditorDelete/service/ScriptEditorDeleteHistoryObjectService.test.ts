import { execute } from "./ScriptEditorDeleteHistoryObjectService";
import { $TIMIELINE_TOOL_SCRIPT_DELETE_COMMAND } from "../../../../../../config/HistoryConfig";

describe("ScriptEditorDeleteHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const script = "var a = \"test\";";
        const object = execute(1, 0, 10, script);
        expect(object.command).toBe($TIMIELINE_TOOL_SCRIPT_DELETE_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(0);
        expect(object.messages[2]).toBe(10);
        expect(object.messages[3]).toBe(script);
    });
});