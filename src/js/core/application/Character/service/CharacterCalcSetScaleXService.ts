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

    if (!Number.isInteger(scale_x)) {
        const value: string = scale_x.toString();
        const index: number = value.indexOf("e");
        if (index !== -1) {
            scale_x = +value.slice(0, index);
        }
        scale_x = +scale_x.toFixed(2);
    }

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