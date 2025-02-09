import type { IHistoryObject } from "@/interface/IHistoryObject";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import type { EmptyCharacter } from "@/core/domain/model/EmptyCharacter";
import { $TIMELINE_SPLIT_EMPTY_KEYFRAME_COMMAND } from "@/config/HistoryConfig";

/**
 * @description 空のキーフレーム分割の履歴用オブジェクトを作成
 *              Create a history object for splitting empty keyframes
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {EmptyCharacter} empty_character
 * @param  {EmptyCharacter} new_empty_character
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
): IHistoryObject => {

    return {
        "command": $TIMELINE_SPLIT_EMPTY_KEYFRAME_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            movie_clip.layers.indexOf(layer),
            empty_character.startFrame,
            new_empty_character.startFrame
        ],
        "args": [
            movie_clip.name,
            layer.name,
            empty_character.startFrame
        ]
    };
};