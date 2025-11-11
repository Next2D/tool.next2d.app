import type { Character } from "@/core/domain/model/Character";
import type { IPosition } from "@/interface/IPosition";
import type { IBounds } from "@/interface/IBounds";
import { $getSelectedElementId } from "../ConvertMovieClipModalUtil";

/**
 * @description アンカー位置の割合
 *              Anchor position ratio
 *
 * @type {Record<string, [number, number]>}
 * @private
 */
const $anchorFrac: Record<string, [number, number]> = {
    "top-left":      [0,   0],
    "middle-left":   [0.5, 0],
    "bottom-left":   [1,   0],
    "top-center":    [0,   0.5],
    "middle-center": [0.5, 0.5],
    "bottom-center": [1,   0.5],
    "top-right":     [0,   1],
    "middle-right":  [0.5, 1],
    "bottom-right":  [1,   1]
};

/**
 * @description ConvertMovieClipModalの選択した中心点に合わせてDisplayObjectの位置を計算
 *              Calculate the position of the DisplayObject according to the selected center point of ConvertMovieClipModal
 *
 * @param  {Character} character
 * @return {IPosition | null}
 * @method
 * @public
 */
export const execute = (character: Character, bounds: IBounds): IPosition =>
{
    const [ax, ay] = $anchorFrac[$getSelectedElementId() as keyof typeof $anchorFrac];
    const offsetX = bounds.xMin + Math.abs(bounds.xMax - bounds.xMin) * ax;
    const offsetY = bounds.yMin + Math.abs(bounds.yMax - bounds.yMin) * ay;

    return {
        "x": character.x - offsetX,
        "y": character.y - offsetY
    };
};