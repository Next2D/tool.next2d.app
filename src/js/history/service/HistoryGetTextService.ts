import { $TIMELINE_TOOL_LAYER_ADD_COMMAD } from "@/config/HistoryConfig";

/**
 * @description 作業履歴のテキスト情報をコマンド名から識別して返却
 *              Identifies and returns work history text information from command names
 *
 * @return {string}
 * @method
 * @public
 */
export const execute = (command: string): string =>
{
    switch (command) {

        case $TIMELINE_TOOL_LAYER_ADD_COMMAD:
            return "レイヤーを追加";

        default:
            break;

    }

    return "";
};