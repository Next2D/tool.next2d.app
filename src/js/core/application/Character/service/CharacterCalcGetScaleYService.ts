/**
 * @description DisplayObjectのスケールYを計算
 *              y基底ベクトルの長さを返却する。行列式が負(=反転している)場合は負の値を返却する。
 *              符号をmatrix[0]から求めると回転角が90度から270度の間で常に負となってしまうため、
 *              反転の有無は行列式で判定する。
 *              Calculate the scale Y of DisplayObject.
 *              Returns the length of the y basis vector, negative if the determinant is negative (flipped).
 *              Deriving the sign from matrix[0] makes it always negative for rotations between 90 and 270 degrees,
 *              so the flip is determined by the determinant.
 *
 * @param  {Float32Array} matrix
 * @return {number}
 * @method
 * @public
 */
export const execute = (matrix: Float32Array): number =>
{
    const det = matrix[0] * matrix[3] - matrix[1] * matrix[2];
    const signY = det < 0 ? -1 : 1;
    return Math.round(Math.hypot(matrix[2], matrix[3]) * signY * 100) / 100;
};
