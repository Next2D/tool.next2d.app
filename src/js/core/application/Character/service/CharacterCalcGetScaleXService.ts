/**
 * @description DisplayObjectのスケールXを計算
 *              Calculate the scale X of DisplayObject
 *
 * @param  {Float32Array} matrix
 * @return {number}
 * @method
 * @public
 */
export const execute = (matrix: Float32Array): number =>
{
    const EPS = 1e-12;
    const signX = (Math.abs(matrix[0]) >= EPS ? Math.sign(matrix[0]) : Math.sign(matrix[1])) || 1;
    return Math.round(Math.hypot(matrix[0], matrix[1]) * signX * 100) / 100;
};