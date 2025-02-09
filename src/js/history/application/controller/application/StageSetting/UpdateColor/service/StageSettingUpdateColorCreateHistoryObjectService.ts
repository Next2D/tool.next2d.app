import type { IHistoryObject } from "@/interface/IHistoryObject";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $STAGE_COLOR_COMMAND } from "@/config/HistoryConfig";

/**
 * @description ステージの背景色の更新の履歴用オブジェクトを作成
 *              Create a history object for updating the background color of the stage
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {string} before_color
 * @param  {string} after_color
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    before_color: string,
    after_color: string
): IHistoryObject => {

    return {
        "command": $STAGE_COLOR_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            before_color,
            after_color
        ],
        "args": [
            before_color,
            after_color
        ]
    };
};