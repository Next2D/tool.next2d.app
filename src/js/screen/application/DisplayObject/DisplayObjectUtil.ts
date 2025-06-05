import { $getConcatenatedMatrix } from "@/controller/application/TransformSetting/TransformSettingUtil";
import { IPosition } from "@/interface/IPosition";
import { Matrix } from "@next2d/geom";

/**
 * @type {boolean}
 * @private
 */
let $pointerId: number = -1;

/**
 * @description 移動対象となったポインターIDを返却
 *              Returns the pointer ID that became the moving target
 *
 * @return {boolean}
 * @method
 * @public
 */
export const $getPointerId = (): number =>
{
    return $pointerId;
};

/**
 * @description 移動対象となったポインターIDを更新
 *              Update the pointer ID that became the moving target
 *
 * @param  {number} pointer_id
 * @return {void}
 * @method
 * @public
 */
export const $setPointerId = (pointer_id: number): void =>
{
    $pointerId = pointer_id;
};

/**
 * @description グローバル座標をローカル座標に変換
 *              Convert global coordinates to local coordinates
 *
 * @param {number} [x=0]
 * @param {number} [y=0]
 * @return {IPosition}
 * @method
 * @public
 */
export const $globalToLocal = (x: number = 0, y: number = 0): IPosition =>
{
    const concatenatedMatrix = $getConcatenatedMatrix();
    const matrix = new Matrix(concatenatedMatrix[0], concatenatedMatrix[1], concatenatedMatrix[2], concatenatedMatrix[3], 0, 0);
    matrix.invert();

    return {
        "x": x * matrix.a + y * matrix.c,
        "y": x * matrix.b + y * matrix.d
    };
};