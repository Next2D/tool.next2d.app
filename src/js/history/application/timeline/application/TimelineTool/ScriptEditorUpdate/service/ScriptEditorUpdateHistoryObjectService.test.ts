import { execute } from "./ScriptEditorUpdateHistoryObjectService";
import { $TIMIELINE_TOOL_SCRIPT_UPDATE_COMMAND } from "../../../../../../../config/HistoryConfig";
import { MovieClip } from "../../../../../../../core/domain/model/MovieClip";

describe("ScriptEditorUpdateHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const movieClip = new MovieClip({
            "id": 0,
            "name": "MovieClip_01",
            "type": "container"
        });

        const beforeScript = "var a = \"test a\";";
        const afterScript  = "var b = \"test b\";";
        const object = execute(1, movieClip, 10, beforeScript, afterScript);
        expect(object.command).toBe($TIMIELINE_TOOL_SCRIPT_UPDATE_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages.length).toBe(5);
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(movieClip.id);
        expect(object.messages[2]).toBe(10);
        expect(object.messages[3]).toBe(beforeScript);
        expect(object.messages[4]).toBe(afterScript);

        // 表示様の配列のチェック
        expect(object.args.length).toBe(2);
        expect(object.args[0]).toBe(movieClip.name);
        expect(object.args[1]).toBe(10);
    });
});