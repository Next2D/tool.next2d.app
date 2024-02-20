import { execute } from "./HistoryGetTextService";
import {
    $TIMELINE_TOOL_LAYER_ADD_COMMAND,
    $TIMELINE_TOOL_LAYER_DELETE_COMMAND,
    $TIMIELINE_TOOL_SCRIPT_NEW_REGISTER_COMMAND,
    $TIMIELINE_TOOL_SCRIPT_UPDATE_COMMAND,
    $TIMIELINE_TOOL_SCRIPT_DELETE_COMMAND,
    $SCREEN_TAB_NAME_UPDATE_COMMAND,
    $LAYER_NAME_UPDATE_COMMAND,
    $LIBRARY_ADD_NEW_FOLDER_COMMAND,
    $LIBRARY_UPDATE_INSTANCE_NAME_COMMAND,
    $LIBRARY_UPDATE_INSTANCE_SYMBOL_COMMAND,
    $LIBRARY_ADD_NEW_BITMAP_COMMAND,
    $LIBRARY_MOVE_FOLDER_COMMAND
} from "../../../../config/HistoryConfig";

describe("HistoryGetTextServiceTest", () =>
{
    test("execute test", () =>
    {
        expect(execute($TIMELINE_TOOL_LAYER_ADD_COMMAND)).toBe("レイヤーに「%s」を追加");
        expect(execute($TIMELINE_TOOL_LAYER_DELETE_COMMAND)).toBe("レイヤーの「%s」を削除");
        expect(execute($TIMIELINE_TOOL_SCRIPT_NEW_REGISTER_COMMAND)).toBe("%sフレームにスクリプトを追加");
        expect(execute($TIMIELINE_TOOL_SCRIPT_UPDATE_COMMAND)).toBe("%sフレームのスクリプトを変更");
        expect(execute($TIMIELINE_TOOL_SCRIPT_DELETE_COMMAND)).toBe("%sフレームのスクリプトを削除");
        expect(execute($SCREEN_TAB_NAME_UPDATE_COMMAND)).toBe("プロジェクト名「%s」を「%s」に変更");
        expect(execute($LAYER_NAME_UPDATE_COMMAND)).toBe("レイヤー名「%s」を「%s」変更");
        expect(execute($LIBRARY_ADD_NEW_FOLDER_COMMAND)).toBe("新規フォルダー");
        expect(execute($LIBRARY_UPDATE_INSTANCE_NAME_COMMAND)).toBe("インスタンス名「%s」を「%s」変更");
        expect(execute($LIBRARY_UPDATE_INSTANCE_SYMBOL_COMMAND)).toBe("シンボル名を「%s」に変更");
        expect(execute($LIBRARY_ADD_NEW_BITMAP_COMMAND)).toBe("画像「%s」を取り込み");
        expect(execute($LIBRARY_MOVE_FOLDER_COMMAND)).toBe("「%s」のフォルダ移動");
    });
});