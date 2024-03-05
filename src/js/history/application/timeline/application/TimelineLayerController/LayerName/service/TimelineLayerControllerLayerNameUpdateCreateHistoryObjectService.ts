import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $LAYER_NAME_UPDATE_COMMAND } from "@/config/HistoryConfig";

/**
 * @description レイヤー追加の履歴用オブジェクトを作成
 *              Create object for layer addition history
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {number} index
 * @param  {string} before_name
 * @param  {string} after_name
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    index: number,
    before_name: string,
    after_name: string
): HistoryObjectImpl => {

    return {
        "command": $LAYER_NAME_UPDATE_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            index,
            before_name,
            after_name
        ],
        "args": [
            movie_clip.name,
            before_name,
            after_name
        ]
    };
};