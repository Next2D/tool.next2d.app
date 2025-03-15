import type { IHistoryObject } from "@/interface/IHistoryObject";
import type { IShapeSaveObject } from "@/interface/IShapeSaveObject";
import type { IBounds } from "@/interface/IBounds";
import { $LIBRARY_UPDATE_SHAPE_GRAPHICS_COMMAND } from "@/config/HistoryConfig";

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
    shape_object: IShapeSaveObject,
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