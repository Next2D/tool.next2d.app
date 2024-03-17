import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $TIMELINE_MOVE_LAYER_COMMAND } from "@/config/HistoryConfig";

/**
 * @description レイヤー追加の履歴用オブジェクトを作成
 *              Create object for layer addition history
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {number} before_index
 * @param  {number} after_index
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    before_index: number,
    after_index: number,
    layer_name: string
): HistoryObjectImpl => {

    return {
        "command": $TIMELINE_MOVE_LAYER_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            before_index,
            after_index
        ],
        "args": [
            layer_name
        ]
    };
};