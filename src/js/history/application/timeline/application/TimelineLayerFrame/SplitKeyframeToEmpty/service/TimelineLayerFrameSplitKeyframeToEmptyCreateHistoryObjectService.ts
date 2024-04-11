import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import { $TIMELINE_SPLIT_KEYFRAME_TO_EMPTY_COMMAND } from "@/config/HistoryConfig";
import type { EmptyCharacter } from "@/core/domain/model/EmptyCharacter";

/**
 * @description キーフレーム分割の履歴用オブジェクトを作成
 *              Create a history object for splitting keyframes
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {EmptyCharacter} empty_character
 * @param  {number} keyframe
 * @param  {number} character_keyframe
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    layer: Layer,
    empty_character: EmptyCharacter,
    keyframe: number,
    character_keyframe: number
): HistoryObjectImpl => {

    return {
        "command": $TIMELINE_SPLIT_KEYFRAME_TO_EMPTY_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            movie_clip.layers.indexOf(layer),
            layer.emptyCharacters.indexOf(empty_character),
            keyframe,
            character_keyframe
        ],
        "args": [
            movie_clip.name,
            layer.name,
            character_keyframe
        ]
    };
};