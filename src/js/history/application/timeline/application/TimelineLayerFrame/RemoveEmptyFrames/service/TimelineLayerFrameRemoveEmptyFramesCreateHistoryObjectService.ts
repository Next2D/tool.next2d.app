import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import type { EmptyCharacter } from "@/core/domain/model/EmptyCharacter";
import { $TIMELINE_REMOVE_EMPTY_FRAMES_COMMAND } from "@/config/HistoryConfig";

/**
 * @description 空のキーフレームのフレーム削除の履歴用オブジェクトを作成
 *              Create a history object for deleting frames of empty keyframes
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {EmptyCharacter} empty_character
 * @param  {number} before_end_frame
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    layer: Layer,
    empty_character: EmptyCharacter,
    before_end_frame: number
): HistoryObjectImpl => {

    return {
        "command": $TIMELINE_REMOVE_EMPTY_FRAMES_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            movie_clip.layers.indexOf(layer),
            layer.emptyCharacters.indexOf(empty_character),
            before_end_frame,
            empty_character.endFrame
        ],
        "args": [
            movie_clip.name,
            layer.name,
            empty_character.startFrame,
            before_end_frame - empty_character.endFrame
        ]
    };
};