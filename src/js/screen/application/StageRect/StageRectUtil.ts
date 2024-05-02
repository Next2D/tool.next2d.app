import type { PositionImpl } from "@/interface/PositionImpl";

/**
 * @type {object}
 * @private
 */
const $position: PositionImpl = {
    "x": 0,
    "y": 0
};

/**
 * @description 選択範囲の座標を返却
 *              Returns the coordinates of the selected range
 *
 * @return {object}
 * @method
 * @public
 */
export const $getPositon = (): PositionImpl =>
{
    return $position;
};