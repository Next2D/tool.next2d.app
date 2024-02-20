import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import { $LIBRARY_UPDATE_INSTANCE_SYMBOL_COMMAND } from "@/config/HistoryConfig";

/**
 * @description インスタンスのシンボル名更新の履歴用オブジェクトを作成
 *              Create object for history of instance symbol name updates
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
        "command": $LIBRARY_UPDATE_INSTANCE_SYMBOL_COMMAND,
        "messages": [
            work_space_id,
            movie_clip_id,
            instance_id,
            before_name,
            after_name
        ],
        "args": [
            before_name,
            after_name
        ]
    };
};