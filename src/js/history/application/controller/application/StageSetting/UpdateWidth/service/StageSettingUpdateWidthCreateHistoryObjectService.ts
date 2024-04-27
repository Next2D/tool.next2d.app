import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $STAGE_WIDTH_COMMAND } from "@/config/HistoryConfig";

/**
 * @description ステージの幅の更新の履歴用オブジェクトを作成
 *              Create a history object for updating the width of the stage
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {number} before_volume
 * @param  {number} after_volume
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    before_volume: number,
    after_volume: number
): HistoryObjectImpl => {

    return {
        "command": $STAGE_WIDTH_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            before_volume,
            after_volume
        ],
        "args": [
            before_volume,
            after_volume
        ]
    };
};