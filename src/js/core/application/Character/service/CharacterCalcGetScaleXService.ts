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

    return 0 > matrix[0] ? xScale * -1 : xScale;
};