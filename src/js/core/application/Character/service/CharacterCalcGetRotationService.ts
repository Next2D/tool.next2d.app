/**
 * @member {number};
 * @private
 */
const $radToDeg = 180 / Math.PI;

/**
 * @description DisplayObjectの回転角度を返却
 *              Returns the rotation angle of DisplayObject
 *
 * @param  {Float32Array} matrix
 * @return {number}
 * @method
 * @public
 */
export const execute = (matrix: Float32Array): number =>
{
    return Math.round(Math.atan2(matrix[1], matrix[0]) * $radToDeg) % 360;
};