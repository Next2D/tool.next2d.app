import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import { $LIBRARY_MOVE_FOLDER_COMMAND } from "@/config/HistoryConfig";

/**
 * @description 新規フォルダー追加の履歴用オブジェクトを作成
 *              Create object for history of adding new folders
 *
 * @param  {number} work_space_id
 * @param  {number} movie_clip_id
 * @param  {number} instance_id
 * @param  {number} before_folder_id
 * @param  {number} after_folder_id
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip_id: number,
    instance_id: number,
    before_folder_id: number,
    after_folder_id: number
): HistoryObjectImpl => {

    return {
        "command": $LIBRARY_MOVE_FOLDER_COMMAND,
        "messages": [
            work_space_id,
            movie_clip_id,
            instance_id,
            before_folder_id,
            after_folder_id
        ],
        "args": []
    };
};