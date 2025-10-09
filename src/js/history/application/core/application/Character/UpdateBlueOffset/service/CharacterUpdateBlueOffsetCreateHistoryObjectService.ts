import type { IHistoryObject } from "@/interface/IHistoryObject";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import type { Character } from "@/core/domain/model/Character";
import { $CHARACTER_UPDATE_BLUE_OFFSET_COMMAND } from "@/config/HistoryConfig";

/**
 * @description DisplayObjectの青色オフセットの変更の履歴オブジェクトを作成
 *              Create a history object for changing the blue offset of DisplayObject
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {number} after_blue
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    layer: Layer,
    character: Character,
    after_blue: number
): IHistoryObject => {

    return {
        "command": $CHARACTER_UPDATE_BLUE_OFFSET_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            movie_clip.layers.indexOf(layer),
            character.startFrame,
            character.depth,
            Math.floor(character.colorTransform[6]),
            Math.floor(after_blue)
        ],
        "args": [
            movie_clip.name,
            layer.name,
            character.startFrame,
            character.depth,
            Math.floor(character.colorTransform[6]),
            Math.floor(after_blue)
        ]
    };
};