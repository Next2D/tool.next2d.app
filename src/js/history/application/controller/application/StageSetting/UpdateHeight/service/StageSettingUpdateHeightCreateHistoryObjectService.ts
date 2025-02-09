import type { IHistoryObject } from "@/interface/IHistoryObject";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $STAGE_HEIGHT_COMMAND } from "@/config/HistoryConfig";

/**
 * @description ステージの高さの更新の履歴用オブジェクトを作成
 *              Create a history object for updating the height of the stage
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {number} before_height
 * @param  {number} after_height
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    before_height: number,
    after_height: number
): IHistoryObject => {

    return {
        "command": $STAGE_HEIGHT_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            before_height,
            after_height
        ],
        "args": [
            before_height,
            after_height
        ]
    };
};