/**
 * @description DisplayObjectのスケールYを計算
 *              Calculate the scale Y of DisplayObject
 *
 * @param  {Float32Array} matrix
 * @return {number}
 * @method
 * @public
 */
export const execute = (matrix: Float32Array): number =>
{
    const EPS = 1e-12;

    const sxAbs = Math.round(Math.hypot(matrix[0], matrix[1]) * 100) / 100;
    const signX = (Math.abs(matrix[0]) >= EPS ? Math.sign(matrix[0]) : Math.sign(matrix[1])) || 1;

    return (matrix[0] * matrix[3] - matrix[1] * matrix[2]) / (sxAbs * signX);
};