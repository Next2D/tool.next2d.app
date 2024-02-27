import { execute } from "./ScriptEditorNewRegisterHistoryObjectService";
import { $TIMIELINE_TOOL_SCRIPT_NEW_REGISTER_COMMAND } from "../../../../../../../config/HistoryConfig";

describe("ScriptEditorNewRegisterHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const script = "var a = \"test\";";
        const object = execute(1, 0, 10, script);
        expect(object.command).toBe($TIMIELINE_TOOL_SCRIPT_NEW_REGISTER_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages.length).toBe(4);
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(0);
        expect(object.messages[2]).toBe(10);
        expect(object.messages[3]).toBe(script);

        // 表示様の配列のチェック
        expect(object.args.length).toBe(1);
        expect(object.args[0]).toBe(10);
    });
});