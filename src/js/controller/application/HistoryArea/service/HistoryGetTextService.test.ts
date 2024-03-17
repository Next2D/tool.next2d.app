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
    $LIBRARY_MOVE_FOLDER_COMMAND,
    $LIBRARY_OVERWRITE_IMAGE_COMMAND,
    $LIBRARY_ADD_NEW_VIDEO_COMMAND,
    $LIBRARY_OVERWRITE_VIDEO_COMMAND,
    $LIBRARY_ADD_NEW_SOUND_COMMAND,
    $LIBRARY_OVERWRITE_SOUND_COMMAND,
    $LIBRARY_ADD_NEW_MOVIE_CLIP_COMMAND,
    $LIBRARY_REMOVE_INSTANCE_COMMAND,
    $TIMELINE_MOVE_LAYER_COMMAND
} from "../../../../config/HistoryConfig";

describe("HistoryGetTextServiceTest", () =>
{
    test("execute test", () =>
    {
        expect(execute($TIMELINE_TOOL_LAYER_ADD_COMMAND)).toBe("「%s1」にレイヤー「%s2」を追加");
        expect(execute($TIMELINE_TOOL_LAYER_DELETE_COMMAND)).toBe("「%s1」のレイヤー「%s2」を削除");
        expect(execute($TIMIELINE_TOOL_SCRIPT_NEW_REGISTER_COMMAND)).toBe("「%s1」の%s2フレームにスクリプトを追加");
        expect(execute($TIMIELINE_TOOL_SCRIPT_UPDATE_COMMAND)).toBe("「%s1」の%s2フレームのスクリプトを変更");
        expect(execute($TIMIELINE_TOOL_SCRIPT_DELETE_COMMAND)).toBe("「%s1」の%s2フレームのスクリプトを削除");
        expect(execute($SCREEN_TAB_NAME_UPDATE_COMMAND)).toBe("プロジェクト名「%s1」を「%s2」に変更");
        expect(execute($LAYER_NAME_UPDATE_COMMAND)).toBe("「%s1」のレイヤー名「%s2」を「%s3」に変更");
        expect(execute($LIBRARY_ADD_NEW_FOLDER_COMMAND)).toBe("新規フォルダー「%s1」を追加");
        expect(execute($LIBRARY_UPDATE_INSTANCE_NAME_COMMAND)).toBe("「%s1」の名前を「%s2」に変更");
        expect(execute($LIBRARY_UPDATE_INSTANCE_SYMBOL_COMMAND)).toBe("「%s1」のシンボル名を「%s2」に変更");
        expect(execute($LIBRARY_MOVE_FOLDER_COMMAND)).toBe("「%s1」のフォルダ移動");
        expect(execute($LIBRARY_ADD_NEW_BITMAP_COMMAND)).toBe("画像「%s1」を取り込み");
        expect(execute($LIBRARY_OVERWRITE_IMAGE_COMMAND)).toBe("「%s1」を画像に上書き");
        expect(execute($LIBRARY_ADD_NEW_VIDEO_COMMAND)).toBe("動画「%s1」を取り込み");
        expect(execute($LIBRARY_OVERWRITE_VIDEO_COMMAND)).toBe("「%s1」を動画に上書き");
        expect(execute($LIBRARY_ADD_NEW_SOUND_COMMAND)).toBe("音声「%s1」を取り込み");
        expect(execute($LIBRARY_OVERWRITE_SOUND_COMMAND)).toBe("「%s1」を音声に上書き");
        expect(execute($LIBRARY_ADD_NEW_MOVIE_CLIP_COMMAND)).toBe("新規MovieClip「%s1」を追加");
        expect(execute($LIBRARY_REMOVE_INSTANCE_COMMAND)).toBe("ライブラリから「%s1」を削除");
        expect(execute($TIMELINE_MOVE_LAYER_COMMAND)).toBe("レイヤー「%s1」を移動");
    });
});