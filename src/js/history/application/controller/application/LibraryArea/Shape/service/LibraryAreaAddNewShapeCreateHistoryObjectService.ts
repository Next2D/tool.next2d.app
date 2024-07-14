import type { HistoryObjectImpl } from "@/interface/HistoryObjectImpl";
import type { ShapeSaveObjectImpl } from "@/interface/ShapeSaveObjectImpl";
import { $LIBRARY_ADD_NEW_SHAPE_COMMAND } from "@/config/HistoryConfig";

/**
 * @description 新規Shape追加の履歴用オブジェクトを作成
 *              Create object for history of adding new Shape
 *
 * @param  {number} work_space_id
 * @param  {number} movie_clip_id
 * @param  {object} shape_object
 * @param  {string} [file_id=""]
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip_id: number,
    shape_object: ShapeSaveObjectImpl,
    file_id: string = ""
): HistoryObjectImpl => {

    return {
        "command": $LIBRARY_ADD_NEW_SHAPE_COMMAND,
        "messages": [
            work_space_id,
            movie_clip_id,
            shape_object,
            file_id
        ],
        "args": [
            shape_object.name
        ]
    };
};