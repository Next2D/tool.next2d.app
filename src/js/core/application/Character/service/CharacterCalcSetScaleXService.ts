/**
 * @description DisplayObjectのスケールXを計算
 *              Calculate the scale X of DisplayObject
 *
 * @param  {number} scale_x
 * @param  {number} current_scale_x
 * @param  {Float32Array} matrix
 * @return {number}
 * @method
 * @public
 */
export const execute = (
    scale_x: number,
    current_scale_x: number | null,
    matrix: Float32Array
): number => {

    scale_x = Math.round(scale_x * 10000) / 10000;
    if (current_scale_x === scale_x) {
        return scale_x;
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

    return scale_x;
};