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
    matrix: number[]
): number => {

    if (!Number.isInteger(scale_y)) {
        const value: string = scale_y.toString();
        const index: number = value.indexOf("e");
        if (index !== -1) {
            scale_y = +value.slice(0, index);
        }
        scale_y = +scale_y.toFixed(2);
    }

    if (current_scale_y === scale_y) {
        return scale_y;
    }

    if (matrix[3] === 0 || isNaN(matrix[3])) {

        matrix[4] = scale_y;

    } else {

        let radianY = Math.atan2(-matrix[3], matrix[4]);
        if (radianY === -Math.PI) {
            radianY = 0;
        }
        matrix[3] = -scale_y * Math.sin(radianY);
        matrix[4] = scale_y  * Math.cos(radianY);

    }

    return scale_y;
};