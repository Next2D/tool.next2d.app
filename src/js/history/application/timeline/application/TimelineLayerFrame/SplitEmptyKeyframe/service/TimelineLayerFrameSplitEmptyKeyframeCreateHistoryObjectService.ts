import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import type { EmptyCharacter } from "@/core/domain/model/EmptyCharacter";
import { $TIMELINE_SPLIT_EMPTY_KEYFRAME_COMMAND } from "@/config/HistoryConfig";

/**
 * @description 空のキーフレーム変更の履歴用オブジェクトを作成
 *              Create a history object for changing an empty keyframe
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {number} empty_character_index
 * @param  {number} start_frame
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
    empty_character: EmptyCharacter,
    new_empty_character: EmptyCharacter
): HistoryObjectImpl => {

    return {
        "command": $TIMELINE_SPLIT_EMPTY_KEYFRAME_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            movie_clip.layers.indexOf(layer),
            layer.emptyCharacters.indexOf(empty_character),
            layer.emptyCharacters.indexOf(new_empty_character)
        ],
        "args": [
            movie_clip.name,
            layer.name,
            empty_character.startFrame
        ]
    };
};