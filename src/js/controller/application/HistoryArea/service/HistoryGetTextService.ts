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
    $LIBRARY_UPDATE_INSTANCE_SYMBOL_COMMAND
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
            return "レイヤーを追加";

        case $TIMELINE_TOOL_LAYER_DELETE_COMMAND:
            return "レイヤーを削除";

        case $TIMIELINE_TOOL_SCRIPT_NEW_REGISTER_COMMAND:
            return "スクリプトを追加";

        case $TIMIELINE_TOOL_SCRIPT_UPDATE_COMMAND:
            return "スクリプトを変更";

        case $TIMIELINE_TOOL_SCRIPT_DELETE_COMMAND:
            return "スクリプトを削除";

        case $SCREEN_TAB_NAME_UPDATE_COMMAND:
            return "プロジェクト名を変更";

        case $LAYER_NAME_UPDATE_COMMAND:
            return "レイヤー名を変更";

        case $LIBRARY_ADD_NEW_FOLDER_COMMAND:
            return "新規フォルダー";

        case $LIBRARY_UPDATE_INSTANCE_NAME_COMMAND:
            return "インスタンス名を変更";

        case $LIBRARY_UPDATE_INSTANCE_SYMBOL_COMMAND:
            return "シンボル名を変更";

        default:
            break;

    }

    return "";
};