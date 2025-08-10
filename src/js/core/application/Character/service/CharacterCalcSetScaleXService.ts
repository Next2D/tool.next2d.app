/**
 * @description DisplayObjectのスケールXを計算
 *              Calculate the scale X of DisplayObject
 *
 * @param  {number} scale_x
 * @param  {Float32Array} matrix
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    scale_x: number,
    matrix: Float32Array
): void => {

    scale_x = Math.round(scale_x * 100) / 100;
    const currentScaleX = Math.round(Math.hypot(matrix[0], matrix[1]) * 100) / 100;
    if (currentScaleX === scale_x) {
        return ;
    }

    if (matrix[1] === 0 || isNaN(matrix[1])) {

        matrix[0] = scale_x;

    } else {

        let radianX = Math.atan2(matrix[1], matrix[0]);
        if (radianX === -Math.PI) {
            radianX = 0;
        }

        matrix[1] = scale_x * Math.sin(radianX);
        matrix[0] = scale_x * Math.cos(radianX);

    }
};