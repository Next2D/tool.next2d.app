import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import { $TIMELINE_SPLIT_KEYFRAME_COMMAND } from "@/config/HistoryConfig";
import type { EmptyCharacter } from "@/core/domain/model/EmptyCharacter";

/**
 * @description キーフレーム分割の履歴用オブジェクトを作成
 *              Create a history object for splitting keyframes
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {number} keyframe
 * @param  {EmptyCharacter} empty_character
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    layer: Layer,
    keyframe: number,
    empty_character: EmptyCharacter
): HistoryObjectImpl => {

    return {
        "command": $TIMELINE_SPLIT_KEYFRAME_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            movie_clip.layers.indexOf(layer),
            keyframe,
            layer.emptyCharacters.indexOf(empty_character)
        ],
        "args": [
            movie_clip.name,
            layer.name,
            keyframe
        ]
    };
};