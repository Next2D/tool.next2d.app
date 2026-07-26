import { execute as characterCalcGetScaleYService } from "../service/CharacterCalcGetScaleYService";

/**
 * @description DisplayObjectのスケールYを計算
 *              y基底ベクトルの向きは維持したまま、長さだけを更新する。
 *              負の値が指定された場合はy基底を180度回して表現する(=反転)。
 *              Calculate the scale Y of DisplayObject.
 *              Updates only the length while keeping the direction of the y basis vector.
 *              If a negative value is specified, it is expressed by rotating the y basis by 180 degrees (flip).
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

        // y基底がx軸成分を持たない場合は、行列式の符号を合わせてdを直接更新する
        matrix[3] = matrix[0] < 0 ? -scale_y : scale_y;

    } else {

        // 反転の有無は行列式で判定し、符号が変わる場合のみy基底を180度回す
        const det = matrix[0] * matrix[3] - matrix[1] * matrix[2];
        const currentSign = det < 0 ? -1 : 1;
        const targetSign  = scale_y < 0 ? -1 : 1;

        const theta = Math.atan2(-matrix[2], matrix[3])
            + (currentSign === targetSign ? 0 : Math.PI);

        const use = Math.abs(scale_y);
        matrix[2] = -use * Math.sin(theta);
        matrix[3] =  use * Math.cos(theta);
    }
};
