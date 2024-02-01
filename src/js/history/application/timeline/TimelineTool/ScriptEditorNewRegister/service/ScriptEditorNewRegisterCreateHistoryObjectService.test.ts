import { execute } from "./ScriptEditorNewRegisterCreateHistoryObjectService";
import { $TIMIELINE_TOOL_SCRIPT_NEW_REGISTER_COMMAND } from "../../../../../../config/HistoryConfig";
import { Layer } from "../../../../../../core/domain/model/Layer";

describe("ScriptEditorNewRegisterCreateHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const layer = new Layer();
        layer.name = "test_layer";

        const script = "var a = \"test\";";
        const object = execute(1, 0, 10,script );
        expect(object.command).toBe($TIMIELINE_TOOL_SCRIPT_NEW_REGISTER_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.args[0]).toBe(1);
        expect(object.args[1]).toBe(0);
        expect(object.args[2]).toBe(10);
        expect(object.args[3]).toBe(script);
    });
});