import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { IPosition } from "@/interface/IPosition";
import { referenceSetting } from "@/controller/domain/model/ReferenceSetting";
import { $getPivotPosition } from "../ReferenceSettingUtil";
import { execute as screenAreaCalcSelectedBoundsService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService";

/**
 * @description 選択中のDisplayObjectの変形の中心点のグローバル座標を取得
 *              Get the global coordinates of the center point of the deformation of the selected DisplayObject
 *
 * @param  {MovieClip} movie_clip
 * @return {IPosition | null}
 * @method
 * @public
 */
export const execute = (movie_clip: MovieClip): IPosition | null =>
{
    if (!movie_clip.selectedDepths.size) {
        return null;
    }

    const bounds = screenAreaCalcSelectedBoundsService(movie_clip);
    if (!bounds) {
        return null;
    }

    const width    = Math.abs(bounds.xMax - bounds.xMin);
    const height   = Math.abs(bounds.yMax - bounds.yMin);
    const position = $getPivotPosition(referenceSetting.pivot, width, height);

    return {
        "x": position.x,
        "y": position.y
    };
};