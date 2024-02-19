import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import { $LIBRARY_FOLDER_STATE_COMMAND } from "@/config/HistoryConfig";
import { FolderTypeImpl } from "@/interface/FolderTypeImpl";

/**
 * @description フォルダ開閉の画面共有用のオブジェクトを作成
 *              Create object for folder open/close screen sharing
 *
 * @param  {number} work_space_id
 * @param  {number} folder_id
 * @param  {string} mode
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    folder_id: number,
    mode: FolderTypeImpl
): HistoryObjectImpl => {

    return {
        "command": $LIBRARY_FOLDER_STATE_COMMAND,
        "messages": [
            work_space_id,
            folder_id,
            mode
        ],
        "args": []
    };
};