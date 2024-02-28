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
    $LIBRARY_ADD_NEW_MOVIE_CLIP_COMMAND
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
            return "レイヤーに「%s」を追加";

        case $TIMELINE_TOOL_LAYER_DELETE_COMMAND:
            return "レイヤーの「%s」を削除";

        case $TIMIELINE_TOOL_SCRIPT_NEW_REGISTER_COMMAND:
            return "%sフレームにスクリプトを追加";

        case $TIMIELINE_TOOL_SCRIPT_UPDATE_COMMAND:
            return "%sフレームのスクリプトを変更";

        case $TIMIELINE_TOOL_SCRIPT_DELETE_COMMAND:
            return "%sフレームのスクリプトを削除";

        case $SCREEN_TAB_NAME_UPDATE_COMMAND:
            return "プロジェクト名「%s」を「%s」に変更";

        case $LAYER_NAME_UPDATE_COMMAND:
            return "レイヤー名「%s」を「%s」変更";

        case $LIBRARY_ADD_NEW_FOLDER_COMMAND:
            return "新規フォルダー「%s」を追加";

        case $LIBRARY_UPDATE_INSTANCE_NAME_COMMAND:
            return "インスタンス名「%s」を「%s」変更";

        case $LIBRARY_UPDATE_INSTANCE_SYMBOL_COMMAND:
            return "シンボル名を「%s」に変更";

        case $LIBRARY_ADD_NEW_BITMAP_COMMAND:
            return "画像「%s」を取り込み";

        case $LIBRARY_MOVE_FOLDER_COMMAND:
            return "「%s」のフォルダ移動";

        case $LIBRARY_OVERWRITE_IMAGE_COMMAND:
            return "「%s」の画像を上書き";

        case $LIBRARY_ADD_NEW_VIDEO_COMMAND:
            return "動画「%s」を取り込み";

        case $LIBRARY_OVERWRITE_VIDEO_COMMAND:
            return "「%s」の動画を上書き";

        case $LIBRARY_ADD_NEW_SOUND_COMMAND:
            return "音声「%s」を取り込み";

        case $LIBRARY_OVERWRITE_SOUND_COMMAND:
            return "「%s」の音声を上書き";

        case $LIBRARY_ADD_NEW_MOVIE_CLIP_COMMAND:
            return "新規MovieClip「%s」を追加";

        default:
            break;

    }

    return "";
};