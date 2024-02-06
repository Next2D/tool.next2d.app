import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import { $LIBRARY_UPDATE_INSTANCE_NAME_COMMAND } from "@/config/HistoryConfig";

/**
 * @description 新規フォルダー追加の履歴用オブジェクトを作成
 *              Create object for history of adding new folders
 *
 * @param  {number} work_space_id
 * @param  {number} movie_clip_id
 * @param  {number} instance_id
 * @param  {string} before_name
 * @param  {string} after_name
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip_id: number,
    instance_id: number,
    before_name: string,
    after_name: string
): HistoryObjectImpl => {

    return {
        "command": $LIBRARY_UPDATE_INSTANCE_NAME_COMMAND,
        "args": [
            work_space_id,
            movie_clip_id,
            instance_id,
            before_name,
            after_name
        ]
    };
};