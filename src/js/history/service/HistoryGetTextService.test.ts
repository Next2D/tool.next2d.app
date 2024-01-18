import { execute } from "./HistoryGetTextService";
import {
    $TIMELINE_TOOL_LAYER_ADD_COMMAND,
    $TIMELINE_TOOL_LAYER_DELETE_COMMAND,
    $TIMIELINE_TOOL_SCRIPT_NEW_REGISTER_COMMAND,
    $TIMIELINE_TOOL_SCRIPT_UPDATE_COMMAND,
    $TIMIELINE_TOOL_SCRIPT_DELETE_COMMAND,
    $SCREEN_TAB_NAME_UPDATE_COMMAND
} from "../../config/HistoryConfig";

describe("HistoryGetTextServiceTest", () =>
{
    test("execute test", () =>
    {
        expect(execute($TIMELINE_TOOL_LAYER_ADD_COMMAND)).toBe("レイヤーを追加");
        expect(execute($TIMELINE_TOOL_LAYER_DELETE_COMMAND)).toBe("レイヤーを削除");
        expect(execute($TIMIELINE_TOOL_SCRIPT_NEW_REGISTER_COMMAND)).toBe("スクリプトを追加");
        expect(execute($TIMIELINE_TOOL_SCRIPT_UPDATE_COMMAND)).toBe("スクリプトを変更");
        expect(execute($TIMIELINE_TOOL_SCRIPT_DELETE_COMMAND)).toBe("スクリプトを削除");
        expect(execute($SCREEN_TAB_NAME_UPDATE_COMMAND)).toBe("プロジェクト名を変更");
    });
});