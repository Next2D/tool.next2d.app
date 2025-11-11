import type { Character } from "@/core/domain/model/Character";
import type { IPosition } from "@/interface/IPosition";
import type { IBounds } from "@/interface/IBounds";
import {
    $anchorFrac,
    $getSelectedElementId
} from "../ConvertMovieClipModalUtil";

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