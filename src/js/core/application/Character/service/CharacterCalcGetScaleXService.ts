/**
 * @description DisplayObjectのスケールXを計算
 *              x基底ベクトルの長さを返却する。
 *              反転(負の値)はx基底の角度に180度として畳み込まれ、rotation側で表現されるため、
 *              ここでは常に非負の値となる。
 *              Calculate the scale X of DisplayObject.
 *              Returns the length of the x basis vector.
 *              A flip (negative value) is folded into the angle of the x basis as 180 degrees
 *              and is expressed by the rotation, so this value is always non-negative.
 *
 * @param  {Float32Array} matrix
 * @return {number}
 * @method
 * @public
 */
export const execute = (matrix: Float32Array): number =>
{
    return Math.round(Math.hypot(matrix[0], matrix[1]) * 100) / 100;
};
