import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import type { Character } from "@/core/domain/model/Character";
import { $CHARACTER_UPDATE_X_COMMAND } from "@/config/HistoryConfig";

/**
 * @description DisplayObjectのx座標変更の履歴用オブジェクトを作成
 *              Create a history object for changing the x-coordinate of DisplayObject
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {number} before_x
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    layer: Layer,
    character: Character,
    before_x: number
): HistoryObjectImpl => {

    return {
        "command": $CHARACTER_UPDATE_X_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            movie_clip.layers.indexOf(layer),
            character.startFrame,
            character.depth,
            parseFloat(before_x.toFixed(2)),
            parseFloat(character.x.toFixed(2))
        ],
        "args": [
            movie_clip.name,
            layer.name,
            character.startFrame,
            character.depth,
            parseFloat(before_x.toFixed(2)),
            parseFloat(character.x.toFixed(2))
        ]
    };
};