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
} from "@/config/HistoryConfig";

/**
 * @description 作業履歴のテキスト情報をコマンド名から識別して返却
 *              Identifies and returns work history text information from command names
 *
 * @return {number}
 * @method
 * @public
 */
export const execute = (command: number): string =>
{
    switch (command) {

        case $TIMELINE_TOOL_LAYER_ADD_COMMAND:
            return "「%s1」にレイヤー「%s2」を追加";

        case $TIMELINE_TOOL_LAYER_DELETE_COMMAND:
            return "「%s1」のレイヤー「%s2」を削除";

        case $TIMIELINE_TOOL_SCRIPT_NEW_REGISTER_COMMAND:
            return "「%s1」の%s2フレームにスクリプトを追加";

        case $TIMIELINE_TOOL_SCRIPT_UPDATE_COMMAND:
            return "「%s1」の%s2フレームのスクリプトを変更";

        case $TIMIELINE_TOOL_SCRIPT_DELETE_COMMAND:
            return "「%s1」の%s2フレームのスクリプトを削除";

        case $SCREEN_TAB_NAME_UPDATE_COMMAND:
            return "プロジェクト名「%s1」を「%s2」に変更";

        case $LAYER_NAME_UPDATE_COMMAND:
            return "「%s1」のレイヤー名「%s2」を「%s3」に変更";

        case $LIBRARY_ADD_NEW_FOLDER_COMMAND:
            return "新規フォルダー「%s1」を追加";

        case $LIBRARY_UPDATE_INSTANCE_NAME_COMMAND:
            return "「%s1」の名前を「%s2」に変更";

        case $LIBRARY_UPDATE_INSTANCE_SYMBOL_COMMAND:
            return "「%s1」のシンボル名を「%s2」に変更";

        case $LIBRARY_MOVE_FOLDER_COMMAND:
            return "「%s1」のフォルダ移動";

        case $LIBRARY_ADD_NEW_BITMAP_COMMAND:
            return "画像「%s1」を取り込み";

        case $LIBRARY_OVERWRITE_IMAGE_COMMAND:
            return "「%s1」を画像に上書き";

        case $LIBRARY_ADD_NEW_VIDEO_COMMAND:
            return "動画「%s1」を取り込み";

        case $LIBRARY_OVERWRITE_VIDEO_COMMAND:
            return "「%s1」を動画に上書き";

        case $LIBRARY_ADD_NEW_SOUND_COMMAND:
            return "音声「%s1」を取り込み";

        case $LIBRARY_OVERWRITE_SOUND_COMMAND:
            return "「%s1」を音声に上書き";

        case $LIBRARY_ADD_NEW_MOVIE_CLIP_COMMAND:
            return "新規MovieClip「%s1」を追加";

        case $LIBRARY_REMOVE_INSTANCE_COMMAND:
            return "ライブラリから「%s1」を削除";

        case $TIMELINE_MOVE_LAYER_COMMAND:
            return "レイヤー「%s1」を移動";

        default:
            break;

    }

    return "";
};