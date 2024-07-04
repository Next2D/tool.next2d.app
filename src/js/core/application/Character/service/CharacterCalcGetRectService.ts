import type { BoundsImpl } from "@/interface/BoundsImpl";
import { $getCurrentWorkSpace, $getMatrixBounds } from "../../CoreUtil";

/**
 * @description 指定IDのライブラリアイテムの表示領域をmatrixで加工して返却
 *              Returns the display area of the specified library item processed by the matrix
 *
 * @param  {number} library_id
 * @param  {array} matrix
 * @param  {number} [frame=1]
 * @return {object}
 * @method
 * @public
 */
export const execute = (
    library_id: number,
    matrix: number[],
    frame: number = 1
): BoundsImpl | null => {

    const workSpace = $getCurrentWorkSpace();
    const instance  = workSpace.getLibrary(library_id);
    if (!instance) {
        return null;
    }

    // ライブラリアイテムの加工してないバウンディングボックスの値を取得
    const bounds = instance.getRect(frame);

    // matrixを適用したバウンディングボックスの値を取得
    return $getMatrixBounds(
        bounds.xMin,
        bounds.yMin,
        bounds.xMax,
        bounds.yMax,
        matrix
    );
};