import type { IHistoryObject } from "@/interface/IHistoryObject";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import { $TIMELINE_INSERT_KEY_FRAME_COMMAND } from "@/config/HistoryConfig";

/**
 * @description キーフレームへのフレーム追加の履歴用オブジェクトを作成
 *              Create a history object for adding frames to a keyframe
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {number} frame
 * @param  {number} num_frame
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    layer: Layer,
    start_frame: number,
    num_frame: number
): IHistoryObject => {

    return {
        "command": $TIMELINE_INSERT_KEY_FRAME_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            movie_clip.layers.indexOf(layer),
            start_frame,
            num_frame
        ],
        "args": [
            movie_clip.name,
            layer.name,
            movie_clip.currentFrame,
            num_frame
        ]
    };
};