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
    const yScale = Math.round(Math.sqrt(
        matrix[2] * matrix[2]
        + matrix[3] * matrix[3]
    ) * 10000) / 10000;

    return 0 > matrix[3] ? yScale * -1 : yScale;
};