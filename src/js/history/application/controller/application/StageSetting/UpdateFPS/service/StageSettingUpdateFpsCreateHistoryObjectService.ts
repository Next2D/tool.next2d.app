import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $STAGE_FPS_COMMAND } from "@/config/HistoryConfig";

/**
 * @description ステージのフレームレートの更新の履歴用オブジェクトを作成
 *              Create a history object for updating the frame rate of the stage
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {number} before_fps
 * @param  {number} after_fps
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    before_fps: number,
    after_fps: number
): HistoryObjectImpl => {

    return {
        "command": $STAGE_FPS_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            before_fps,
            after_fps
        ],
        "args": [
            before_fps,
            after_fps
        ]
    };
};