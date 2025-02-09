import type { IHistoryObject } from "@/interface/IHistoryObject";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $STAGE_WIDTH_COMMAND } from "@/config/HistoryConfig";

/**
 * @description ステージの幅の更新の履歴用オブジェクトを作成
 *              Create a history object for updating the width of the stage
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {number} before_width
 * @param  {number} after_width
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    before_width: number,
    after_width: number
): IHistoryObject => {

    return {
        "command": $STAGE_WIDTH_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            before_width,
            after_width
        ],
        "args": [
            before_width,
            after_width
        ]
    };
};