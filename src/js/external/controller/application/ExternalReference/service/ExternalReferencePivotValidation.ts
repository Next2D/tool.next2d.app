import type { IPivotType } from "@/interface/IPivotType";

/**
 * @description 座標位置が有効か検証
 *              Validate if the coordinate position is valid
 *
 * @param  {IPivotType} pivot
 * @return {boolean}
 * @method
 * @public
 */
export const execute = (pivot: IPivotType): boolean =>
{
    switch (pivot) {

        case "top-left":
        case "top-center":
        case "top-right":
        case "middle-left":
        case "middle-center":
        case "middle-right":
        case "bottom-left":
        case "bottom-center":
        case "bottom-right":
            return true;

        default:
            break;
    }

    return false;
};