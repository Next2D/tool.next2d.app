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
    const xScale = Math.round(Math.sqrt(
        matrix[0] * matrix[0]
        + matrix[1] * matrix[1]
    ) * 100) / 100;

    const EPS = 1e-12;
    const signX = (Math.abs(matrix[0]) >= EPS ? Math.sign(matrix[0]) : Math.sign(matrix[1])) || 1;
    return xScale * signX;
};