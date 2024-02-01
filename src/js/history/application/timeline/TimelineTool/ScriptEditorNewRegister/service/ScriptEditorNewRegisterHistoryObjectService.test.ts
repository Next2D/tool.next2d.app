import { execute } from "./ScriptEditorNewRegisterHistoryObjectService";
import { $TIMIELINE_TOOL_SCRIPT_NEW_REGISTER_COMMAND } from "../../../../../../config/HistoryConfig";

describe("ScriptEditorNewRegisterHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const script = "var a = \"test\";";
        const object = execute(1, 0, 10, script);
        expect(object.command).toBe($TIMIELINE_TOOL_SCRIPT_NEW_REGISTER_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.args[0]).toBe(1);
        expect(object.args[1]).toBe(0);
        expect(object.args[2]).toBe(10);
        expect(object.args[3]).toBe(script);
    });
});