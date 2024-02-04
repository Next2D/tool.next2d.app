import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import { $LIBRARY_ADD_NEW_FOLDER } from "@/config/HistoryConfig";

/**
 * @description 新規フォルダー追加の履歴用オブジェクトを作成
 *              Create object for history of adding new folders
 *
 * @param  {number} work_space_id
 * @param  {number} instance_id
 * @param  {string} name
 * @param  {number} folder_id
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    instance_id: number,
    name: string,
    folder_id: number
): HistoryObjectImpl => {

    return {
        "command": $LIBRARY_ADD_NEW_FOLDER,
        "args": [
            work_space_id,
            instance_id,
            name,
            folder_id
        ]
    };
};