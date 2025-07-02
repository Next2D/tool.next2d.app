import { $clamp } from "@/global/GlobalUtil";

/**
 * @description 角度をラジアンに変換するための定数
 *              Constant for converting degrees to radians
 *
 * @member {number}
 * @constant
 */
const $Deg2Rad = Math.PI / 180;

/**
 * @description 回転情報を更新する
 *              Update rotation information
 *
 * @param {number} rotation
 * @param {number} current_rotation
 * @param {Float32Array} matrix
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    rotation: number,
    current_rotation: number | null,
    matrix: Float32Array
): number => {

    rotation = $clamp(rotation % 360, 0, 360);
    if (current_rotation === rotation) {
        return rotation;
    }

    const scaleX = Math.sqrt(
        matrix[0] * matrix[0]
            + matrix[1] * matrix[1]
    );
    const scaleY = Math.sqrt(
        matrix[2] * matrix[2]
            + matrix[3] * matrix[3]
    );

    if (rotation === 0) {

        matrix[0] = scaleX;
        matrix[1] = 0;
        matrix[2] = 0;
        matrix[3] = scaleY;

    } else {

        let radianX = Math.atan2(matrix[1], matrix[0]);
        let radianY = Math.atan2(-matrix[2], matrix[3]);

        const radian = rotation * $Deg2Rad;
        radianY = radianY + radian - radianX;
        radianX = radian;

        matrix[1] = scaleX * Math.sin(radianX);
        if (matrix[1] === 1 || matrix[1] === -1) {
            matrix[0] = 0;
        } else {
            matrix[0] = scaleX * Math.cos(radianX);
        }

        matrix[2] = -scaleY * Math.sin(radianY);
        if (matrix[2] === 1 || matrix[2] === -1) {
            matrix[3] = 0;
        } else {
            matrix[3] = scaleY * Math.cos(radianY);
        }
    }

    return rotation;
};