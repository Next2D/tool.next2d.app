/**
 * @description DisplayObjectのスケールXを計算
 *              Calculate the scale Y of DisplayObject
 *
 * @param  {number} scale_y
 * @param  {array} matrix
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    scale_y: number,
    matrix: Float32Array
): void => {

    scale_y = Math.round(scale_y * 100) / 100;
    const currentScaleY = Math.round(Math.hypot(matrix[0], matrix[1]) * 100) / 100;
    if (currentScaleY === scale_y) {
        return ;
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
};