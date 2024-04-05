import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import type { EmptyCharacter } from "@/core/domain/model/EmptyCharacter";
import { $TIMELINE_INSERT_EMPTY_FRAME_COMMAND } from "@/config/HistoryConfig";

/**
 * @description 空のキーフレームへのフレーム追加の履歴用オブジェクトを作成
 *              Create a history object for adding frames to an empty keyframe
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {EmptyCharacter} empty_character
 * @param  {number} num_frame
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    layer: Layer,
    empty_character: EmptyCharacter,
    num_frame: number
): HistoryObjectImpl => {

    return {
        "command": $TIMELINE_INSERT_EMPTY_FRAME_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            movie_clip.layers.indexOf(layer),
            layer.emptyCharacters.indexOf(empty_character),
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