import type { IPosition } from "@/interface/IPosition";

/**
 * @description 2次元点群を指定された軸上に投影する
 *              Projects a set of 2D points onto a specified axis
 *
 * @param  {Array<IPosition>} rect
 * @param  {number} x
 * @param  {number} y
 * @return {number[]}
 * @method
 * @public
 */
export const execute = (rect: Array<IPosition>, x: number, y: number): number[] =>
{
    let min = Infinity;
    let max = -Infinity;
    for (let idx = 0; idx < rect.length; idx++) {
        const position = rect[idx];
        if (!position) {
            continue;
        }

        const t = position.x * x + position.y * y;
        if (t < min) {
            min = t;
        }
        if (t > max) {
            max = t;
        }
    }
    return [min, max];
};