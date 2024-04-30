import type { BoundsImpl } from "@/interface/BoundsImpl";
import { $getCurrentWorkSpace, $getMatrixBounds } from "../../CoreUtil";

/**
 * @description 指定IDのライブラリアイテムのバウンディングボックスをmatrixで加工して返却
 *              Returns the bounding box of the specified library item processed by the matrix
 *
 * @param  {number} library_id
 * @param  {array} matrix
 * @return {object}
 * @method
 * @public
 */
export const execute = (library_id: number, matrix: number[]): BoundsImpl | null =>
{
    const workSpace = $getCurrentWorkSpace();
    const instance  = workSpace.getLibrary(library_id);
    if (!instance) {
        return null;
    }

    // ライブラリアイテムの加工してないバウンディングボックスの値を取得
    const bounds = instance.getRawBounds();

    // matrixを適用したバウンディングボックスの値を取得
    return $getMatrixBounds(
        bounds.xMin,
        bounds.yMin,
        bounds.xMax,
        bounds.yMax,
        matrix
    );
};