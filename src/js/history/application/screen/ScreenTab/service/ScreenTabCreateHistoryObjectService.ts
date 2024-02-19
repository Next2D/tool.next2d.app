import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import { $SCREEN_TAB_NAME_UPDATE_COMMAND } from "@/config/HistoryConfig";

/**
 * @description タブ名変更の履歴用オブジェクトを作成
 *              Create object for history of tab name changes
 *
 * @param  {number} work_space_id
 * @param  {string} before_name
 * @param  {string} after_name
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    before_name: string,
    after_name: string
): HistoryObjectImpl => {

    return {
        "command": $SCREEN_TAB_NAME_UPDATE_COMMAND,
        "messages": [work_space_id, before_name, after_name],
        "args": []
    };
};