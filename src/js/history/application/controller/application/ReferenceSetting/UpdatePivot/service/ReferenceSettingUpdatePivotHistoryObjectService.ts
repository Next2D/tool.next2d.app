import type { IHistoryObject } from "@/interface/IHistoryObject";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $REFERENCE_UPDATE_PIVOT_COMMAND } from "@/config/HistoryConfig";
import { IPivotType } from "@/interface/IPivotType";

/**
 * @description ReferenceSettingのpivot更新の履歴オブジェクトを生成する
 *              Generate a history object for updating the pivot of ReferenceSetting
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} movie_clip
 * @param  {IPivotType} before_pivot
 * @param  {IPivotType} after_pivot
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip: MovieClip,
    before_pivot: IPivotType,
    after_pivot: IPivotType
): IHistoryObject => {

    return {
        "command": $REFERENCE_UPDATE_PIVOT_COMMAND,
        "messages": [
            work_space_id,
            movie_clip.id,
            before_pivot,
            after_pivot
        ],
        "args": [
            before_pivot,
            after_pivot
        ]
    };
};