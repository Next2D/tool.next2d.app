import type { IHistoryObject } from "@/interface/IHistoryObject";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import { $TIMELINE_ADD_EMPTY_KEYFRAME_COMMAND } from "@/config/HistoryConfig";

/**
 * @description 空のキーフレーム追加の履歴用オブジェクトを作成
 *              Create a history object for adding an empty keyframe
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {number} start_frame
 * @param  {number} end_frame
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    layer: Layer,
    start_frame: number,
    end_frame: number
): IHistoryObject => {

    return {
        "command": $TIMELINE_ADD_EMPTY_KEYFRAME_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            movie_clip.layers.indexOf(layer),
            start_frame,
            end_frame
        ],
        "args": [
            movie_clip.name,
            layer.name,
            start_frame
        ]
    };
};