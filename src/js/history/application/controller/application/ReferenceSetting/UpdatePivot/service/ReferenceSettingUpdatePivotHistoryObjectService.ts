import type { IHistoryObject } from "@/interface/IHistoryObject";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { IPivotType } from "@/interface/IPivotType";
import type { Layer } from "@/core/domain/model/Layer";
import type { Character } from "@/core/domain/model/Character";
import { $REFERENCE_UPDATE_PIVOT_COMMAND } from "@/config/HistoryConfig";

/**
 * @description ReferenceSettingのpivot更新の履歴オブジェクトを生成する
 *              Generate a history object for updating the pivot of ReferenceSetting
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {IPivotType} before_pivot
 * @param  {IPivotType} after_pivot
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    layer: Layer,
    character: Character,
    before_pivot: IPivotType,
    after_pivot: IPivotType
): IHistoryObject => {

    return {
        "command": $REFERENCE_UPDATE_PIVOT_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            Array.from(movie_clip.selectedDepths),
            before_pivot,
            after_pivot
        ],
        "args": [
            movie_clip.name,
            layer.name,
            character.startFrame,
            character.depth,
            before_pivot,
            after_pivot
        ]
    };
};