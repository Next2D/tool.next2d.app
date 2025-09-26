import type { IHistoryObject } from "@/interface/IHistoryObject";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import type { Character } from "@/core/domain/model/Character";
import { $REFERENCE_UPDATE_X_COMMAND } from "@/config/HistoryConfig";

/**
 * @description ReferenceSettingのx座標更新の履歴オブジェクトを生成する
 *              Generate a history object for updating the x-coordinate of ReferenceSetting
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {number} after_x
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    layer: Layer,
    character: Character,
    after_x: number
): IHistoryObject => {

    const localPosition = character.referencePosition.getLocalPosition();

    return {
        "command": $REFERENCE_UPDATE_X_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            movie_clip.layers.indexOf(layer),
            character.startFrame,
            character.depth,
            Array.from(movie_clip.selectedDepths),
            localPosition.x, // before_x,
            after_x,
            character.referencePosition.pivot, // before_pivot
            localPosition.y // before_y
        ],
        "args": [
            movie_clip.name,
            layer.name,
            character.startFrame,
            character.depth,
            localPosition.x, // before_x,
            after_x
        ]
    };
};