import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import { $LIBRARY_ADD_NEW_MOVIE_CLIP_COMMAND } from "@/config/HistoryConfig";

/**
 * @description 新規MovieClip追加の履歴用オブジェクトを作成
 *              Create object for history of adding new MovieClip
 *
 * @param  {number} work_space_id
 * @param  {number} movie_clip_id
 * @param  {number} instance_id
 * @param  {string} name
 * @param  {number} folder_id
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip_id: number,
    instance_id: number,
    name: string,
    folder_id: number
): HistoryObjectImpl => {

    return {
        "command": $LIBRARY_ADD_NEW_MOVIE_CLIP_COMMAND,
        "messages": [
            work_space_id,
            movie_clip_id,
            instance_id,
            name,
            folder_id
        ],
        "args": [
            name
        ]
    };
};