/**
 * @description DisplayObjectの回転角度を返却
 *              Returns the rotation angle of DisplayObject
 *
 * @param  {array} matrix
 * @return {number}
 * @method
 * @public
 */
export const execute = (matrix: number[]): number =>
{
    return Math.atan2(matrix[1], matrix[0]) * (180 / Math.PI);
};