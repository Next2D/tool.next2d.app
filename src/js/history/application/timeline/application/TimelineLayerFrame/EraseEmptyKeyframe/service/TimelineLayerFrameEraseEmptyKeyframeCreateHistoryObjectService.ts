import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import type { EmptyCharacter } from "@/core/domain/model/EmptyCharacter";
import { $TIMELINE_ERASE_EMPTY_KEY_FRAME_COMMAND } from "@/config/HistoryConfig";

/**
 * @description 空のキーフレームのフレーム全削除の履歴用オブジェクトを作成
 *              Create a history object for deleting all frames of empty keyframes
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {EmptyCharacter} empty_character
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    layer: Layer,
    empty_character: EmptyCharacter
): HistoryObjectImpl => {

    return {
        "command": $TIMELINE_ERASE_EMPTY_KEY_FRAME_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            movie_clip.layers.indexOf(layer),
            empty_character.startFrame, // keyframe
            empty_character.toObject()
        ],
        "args": [
            movie_clip.name,
            layer.name,
            empty_character.startFrame
        ]
    };
};