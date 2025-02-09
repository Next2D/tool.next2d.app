import type { IHistoryObject } from "@/interface/IHistoryObject";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import { $TIMELINE_UPDATE_KEYFRAME_COMMAND } from "@/config/HistoryConfig";

/**
 * @description キーフレーム変更の履歴用オブジェクトを作成
 *              Create a history object for changing keyframes
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {number} keyframe
 * @param  {number} before_end_frame
 * @param  {number} after_end_frame
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    layer: Layer,
    keyframe: number,
    before_end_frame: number,
    after_end_frame: number
): IHistoryObject => {

    return {
        "command": $TIMELINE_UPDATE_KEYFRAME_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            movie_clip.layers.indexOf(layer),
            keyframe,
            before_end_frame,
            after_end_frame
        ],
        "args": [
            movie_clip.name,
            layer.name,
            keyframe,
            after_end_frame - before_end_frame
        ]
    };
};