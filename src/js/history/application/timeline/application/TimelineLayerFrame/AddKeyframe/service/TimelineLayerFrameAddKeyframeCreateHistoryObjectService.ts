import type { IHistoryObject } from "@/interface/IHistoryObject";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import type { Character } from "@/core/domain/model/Character";
import { $TIMELINE_ADD_KEYFRAME_COMMAND } from "@/config/HistoryConfig";

/**
 * @description キーフレーム追加の履歴用オブジェクトを作成
 *              Create a history object for adding a keyframe
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {number} empty_character_index
 * @param  {string} instance_name
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    layer: Layer,
    character: Character,
    empty_character_index: number,
    instance_name: string
): IHistoryObject => {

    return {
        "command": $TIMELINE_ADD_KEYFRAME_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            movie_clip.layers.indexOf(layer),
            character.toObject(),
            empty_character_index
        ],
        "args": [
            movie_clip.name,
            layer.name,
            character.startFrame,
            instance_name
        ]
    };
};