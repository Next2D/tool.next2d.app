/**
 * @description DisplayObjectのスケールXを計算
 *              Calculate the scale Y of DisplayObject
 *
 * @param  {number} scale_y
 * @param  {number} current_scale_y
 * @param  {array} matrix
 * @return {number}
 * @method
 * @public
 */
export const execute = (
    scale_y: number,
    current_scale_y: number | null,
    matrix: Float32Array
): number => {

    scale_y = Math.round(scale_y * 10000) / 10000;
    if (current_scale_y === scale_y) {
        return scale_y;
    }

    if (matrix[2] === 0 || isNaN(matrix[2])) {

        matrix[3] = scale_y;

    } else {

        let radianY = Math.atan2(-matrix[2], matrix[3]);
        if (radianY === -Math.PI) {
            radianY = 0;
        }
        matrix[2] = -scale_y * Math.sin(radianY);
        matrix[3] = scale_y  * Math.cos(radianY);

    }

    return scale_y;
};