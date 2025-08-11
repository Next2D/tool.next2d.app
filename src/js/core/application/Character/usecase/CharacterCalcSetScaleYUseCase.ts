import { execute as characterCalcGetScaleYService } from "../service/CharacterCalcGetScaleYService";

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
    const currentScaleY = characterCalcGetScaleYService(matrix);
    if (currentScaleY === scale_y) {
        return ;
    }

    if (matrix[2] === 0 || isNaN(matrix[2])) {

        matrix[3] = scale_y;

    } else {

        const targetAbs = Math.max(0, Math.abs(scale_y));

        const EPS = 1e-12;
        let theta = Math.atan2(matrix[1], matrix[0]);
        if (matrix[0] < 0 || Math.abs(matrix[0]) < EPS && matrix[1] < 0) {
            theta -= Math.PI;
        }
        if (theta <= -Math.PI) {
            theta += 2 * Math.PI;
        }
        if (theta > Math.PI) {
            theta -= 2 * Math.PI;
        }

        const thetaUse = theta + (scale_y < 0 ? Math.PI : 0);

        matrix[2] = -targetAbs * Math.sin(thetaUse);
        matrix[3] =  targetAbs * Math.cos(thetaUse);
    }
};