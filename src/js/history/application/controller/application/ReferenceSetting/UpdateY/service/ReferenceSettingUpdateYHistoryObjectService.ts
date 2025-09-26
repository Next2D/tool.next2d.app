import type { IHistoryObject } from "@/interface/IHistoryObject";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import type { Character } from "@/core/domain/model/Character";
import { $REFERENCE_UPDATE_Y_COMMAND } from "@/config/HistoryConfig";

/**
 * @description ReferenceSettingのy座標更新の履歴オブジェクトを生成する
 *              Generate a history object for updating the y-coordinate of ReferenceSetting
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {number} before_y
 * @param  {number} after_y
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    layer: Layer,
    character: Character,
    before_y: number,
    after_y: number
): IHistoryObject => {

    return {
        "command": $REFERENCE_UPDATE_Y_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            movie_clip.layers.indexOf(layer),
            character.startFrame,
            character.depth,
            Array.from(movie_clip.selectedDepths),
            before_y,
            after_y
        ],
        "args": [
            movie_clip.name,
            layer.name,
            character.startFrame,
            character.depth,
            before_y,
            after_y
        ]
    };
};