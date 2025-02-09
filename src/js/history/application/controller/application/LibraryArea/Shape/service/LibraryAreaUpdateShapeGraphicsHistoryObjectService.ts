import type { IHistoryObject } from "@/interface/IHistoryObject";
import type { ShapeSaveObjectImpl } from "@/interface/ShapeSaveObjectImpl";
import { $LIBRARY_UPDATE_SHAPE_GRAPHICS_COMMAND } from "@/config/HistoryConfig";
import { IBounds } from "@/interface/IBounds";

/**
 * @description Shapeの描画レコード更新の履歴用オブジェクトを作成
 *              Create a history object for updating the drawing record of Shape
 *
 * @param  {number} work_space_id
 * @param  {number} movie_clip_id
 * @param  {object} shape_object
 * @param  {Float32Array} recodes
 * @param  {object} bounds
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    movie_clip_id: number,
    shape_object: ShapeSaveObjectImpl,
    recodes: Float32Array | number[],
    bounds: IBounds,
    file_id: string = ""
): IHistoryObject => {

    return {
        "command": $LIBRARY_UPDATE_SHAPE_GRAPHICS_COMMAND,
        "messages": [
            work_space_id,
            movie_clip_id,
            shape_object,
            Array.from(recodes),
            bounds,
            file_id
        ],
        "args": [
            shape_object.name
        ]
    };
};