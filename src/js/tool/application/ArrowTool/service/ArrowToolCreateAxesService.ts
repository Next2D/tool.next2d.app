import type { IPosition } from "@/interface/IPosition";

/**
 * @description x軸・y軸と、四角形の各辺に直交する軸を作成
 *              生成された軸は、四角形の各辺に直交します。
 *
 * @param  {Array<IPosition>} rect
 * @return {Array<number[]>}
 * @method
 * @public
 */
export const execute = (rect: Array<IPosition>): Array<number[]> =>
{
    const axes = [[1, 0], [0, 1]];
    for (let idx = 0; idx < 4; idx++) {
        const p0 = rect[idx];
        const p1 = rect[idx + 1 & 3];

        const ex = p1.x - p0.x;
        const ey = p1.y - p0.y;

        const nx = -ey;
        const ny = ex;

        const length = Math.hypot(nx, ny);
        if (length > 0) {
            axes.push([nx / length, ny / length]);
        }
    }
    return axes;
};