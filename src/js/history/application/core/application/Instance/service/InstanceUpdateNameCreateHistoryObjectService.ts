import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $LIBRARY_UPDATE_INSTANCE_NAME_COMMAND } from "@/config/HistoryConfig";

/**
 * @description インスタンス名更新の履歴用オブジェクトを作成
 *              Create object for history of instance name updates
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {number} instance_id
 * @param  {string} before_name
 * @param  {string} after_name
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    instance_id: number,
    before_name: string,
    after_name: string
): HistoryObjectImpl => {

    return {
        "command": $LIBRARY_UPDATE_INSTANCE_NAME_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
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