import type { IHistoryObject } from "@/interface/IHistoryObject";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import type { Character } from "@/core/domain/model/Character";
import { $CHARACTER_UPDATE_SCALE_Y_COMMAND } from "@/config/HistoryConfig";

/**
 * @description DisplayObjectのyスケール変更の履歴用オブジェクトを作成
 *              Create a history object for changing the y-scale of DisplayObject
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {number} before_scale_y
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    layer: Layer,
    character: Character,
    before_scale_y: number
): IHistoryObject => {

    return {
        "command": $CHARACTER_UPDATE_SCALE_Y_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            movie_clip.layers.indexOf(layer),
            character.startFrame,
            character.depth,
            Math.round(before_scale_y * 10000) / 100,
            character.scaleY * 100
        ],
        "args": [
            movie_clip.name,
            layer.name,
            character.startFrame,
            character.depth,
            Math.round(before_scale_y * 10000) / 100,
            character.scaleY * 100
        ]
    };
};