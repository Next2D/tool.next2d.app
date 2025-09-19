import type { IPivotType } from "@/interface/IPivotType";
import type { IPosition } from "@/interface/IPosition";

/**
 * @description pivot位置から座標を取得
 *              Get coordinates from pivot position
 *
 * @param  {IPivotType} pivot
 * @param  {number} width
 * @param  {number} height
 * @return {IPosition}
 * @method
 * @public
 */
export const $getPivotPosition = (
    pivot: IPivotType,
    width: number,
    height: number
): IPosition => {

    switch (pivot) {

        case "top-left":
            return { "x": 0, "y": 0 };

        case "top-center":
            return { "x": width / 2, "y": 0 };

        case "top-right":
            return { "x": width, "y": 0 };

        case "middle-left":
            return { "x": 0, "y": height / 2 };

        case "middle-center":
            return { "x": width / 2, "y": height / 2 };

        case "middle-right":
            return { "x": width, "y": height / 2 };

        case "bottom-left":
            return { "x": 0, "y": height };

        case "bottom-center":
            return { "x": width / 2, "y": height };

        case "bottom-right":
            return { "x": width, "y": height };

        default:
            return { "x": width / 2, "y": height / 2 };

    }
};