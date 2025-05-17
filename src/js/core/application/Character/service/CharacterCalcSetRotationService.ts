import { $clamp } from "@/global/GlobalUtil";

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

    rotation = $clamp(rotation % 360, 0 - 360, 360);
    if (current_rotation === rotation) {
        return rotation;
    }

    const scaleX: number = Math.sqrt(
        matrix[0] * matrix[0]
            + matrix[1] * matrix[1]
    );
    const scaleY: number = Math.sqrt(
        matrix[3] * matrix[3]
            + matrix[4] * matrix[4]
    );

    if (rotation === 0) {

        matrix[0] = scaleX;
        matrix[1] = 0;
        matrix[2] = 0;
        matrix[3] = scaleY;

    } else {

        const $Deg2Rad = 180 / Math.PI;

        let radianX: number = Math.atan2(matrix[1], matrix[0]);
        let radianY: number = Math.atan2(-matrix[3], matrix[4]);

        const radian: number = rotation * $Deg2Rad;
        radianY = radianY + radian - radianX;
        radianX = radian;

        matrix[1] = scaleX * Math.sin(radianX);
        if (matrix[1] === 1 || matrix[1] === -1) {
            matrix[0] = 0;
        } else {
            matrix[0] = scaleX * Math.cos(radianX);
        }

        matrix[3] = -scaleY * Math.sin(radianY);
        if (matrix[3] === 1 || matrix[3] === -1) {
            matrix[4] = 0;
        } else {
            matrix[4] = scaleY * Math.cos(radianY);
        }
    }

    return rotation;
};