import type { IHistoryObject } from "@/interface/IHistoryObject";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import type { Character } from "@/core/domain/model/Character";
import { $TIMELINE_ERASE_KEY_FRAME_COMMAND } from "@/config/HistoryConfig";

/**
 * @description キーフレームのフレーム全削除の履歴用オブジェクトを作成
 *              Create a history object for deleting all frames of a keyframe
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
    characters: Character[]
): IHistoryObject => {

    const characterSaveObjects = [];
    for (let idx = 0; idx < characters.length; ++idx) {
        const character = characters[idx];
        if (!character) {
            continue;
        }
        characterSaveObjects.push(character.toObject());
    }

    return {
        "command": $TIMELINE_ERASE_KEY_FRAME_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            movie_clip.layers.indexOf(layer),
            characterSaveObjects
        ],
        "args": [
            movie_clip.name,
            layer.name,
            characters[0].startFrame
        ]
    };
};