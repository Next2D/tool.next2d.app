/**
 * @description 行列の掛け算
 *              Matrix multiplication
 *
 * @param  {qrray} a
 * @param  {qrray} b
 * @return {qrray}
 * @method
 * @static
 */
export const $multiplicationMatrix = (a: number[], b: number[]): number[] =>
{
    return [
        a[0] * b[0] + a[2] * b[1],
        a[1] * b[0] + a[3] * b[1],
        a[0] * b[2] + a[2] * b[3],
        a[1] * b[2] + a[3] * b[3],
        a[0] * b[4] + a[2] * b[5] + a[4],
        a[1] * b[4] + a[3] * b[5] + a[5]
    ];
};