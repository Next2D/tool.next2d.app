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

        const EPS = 1e-12;
        const theta = Math.atan2(matrix[1], matrix[0]);

        // 現在の「符号付き scaleX」を推定（a が 0 近傍なら b で判定）
        const sxAbs = Math.hypot(matrix[0], matrix[1]);
        const signX = (Math.abs(matrix[0]) >= EPS ? Math.sign(matrix[0]) : Math.sign(matrix[1])) || 1;
        const sxSigned = sxAbs * signX;

        // 角度正規化：scaleX を「非負」で表せる角度に直す（符号は角度から外す）
        const thetaPos = sxSigned >= 0 ? theta : theta - Math.PI;

        // ターゲットの符号を角度に載せる
        const thetaUse = thetaPos + (scale_x < 0 ? Math.PI : 0);

        const use = Math.abs(scale_x);
        matrix[0] = use * Math.cos(thetaUse);
        matrix[1] = use * Math.sin(thetaUse);
    }
};