import type { IHistoryObject } from "@/interface/IHistoryObject";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import type { Character } from "@/core/domain/model/Character";
import { $CHARACTER_UPDATE_ALPHA_MULTIPLIER_COMMAND } from "@/config/HistoryConfig";

/**
 * @description DisplayObjectの透明度の変更の履歴オブジェクトを作成
 *              Create a history object for changing the alpha transparency of DisplayObject
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {number} after_alpha
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    layer: Layer,
    character: Character,
    after_alpha: number
): IHistoryObject => {

    return {
        "command": $CHARACTER_UPDATE_ALPHA_MULTIPLIER_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            movie_clip.layers.indexOf(layer),
            character.startFrame,
            character.depth,
            Math.floor(character.colorTransform[3] * 100),
            Math.floor(after_alpha)
        ],
        "args": [
            movie_clip.name,
            layer.name,
            character.startFrame,
            character.depth,
            Math.floor(character.colorTransform[3] * 100),
            Math.floor(after_alpha)
        ]
    };
};