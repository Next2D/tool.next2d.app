import { execute as characterCalcGetScaleXService } from "../service/CharacterCalcGetScaleXService";

/**
 * @description DisplayObjectのスケールXを計算
 *              x基底ベクトルの向きは維持したまま、長さだけを更新する。
 *              負の値が指定された場合はx基底を180度回して表現する。
 *              Calculate the scale X of DisplayObject.
 *              Updates only the length while keeping the direction of the x basis vector.
 *              If a negative value is specified, it is expressed by rotating the x basis by 180 degrees.
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
    const currentScaleX = characterCalcGetScaleXService(matrix);
    if (currentScaleX === scale_x) {
        return ;
    }

    if (matrix[1] === 0 || isNaN(matrix[1])) {

        matrix[0] = scale_x;

    } else {

        // 現在のx基底の角度に、負の値であれば180度を載せる
        const theta = Math.atan2(matrix[1], matrix[0])
            + (scale_x < 0 ? Math.PI : 0);

        const use = Math.abs(scale_x);
        matrix[0] = use * Math.cos(theta);
        matrix[1] = use * Math.sin(theta);
    }
};
