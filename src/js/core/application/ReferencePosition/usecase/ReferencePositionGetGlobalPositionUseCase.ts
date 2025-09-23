import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { IPosition } from "@/interface/IPosition";
import { referenceSetting } from "@/controller/domain/model/ReferenceSetting";
import { execute as screenAreaCalcSelectedBoundsService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService";
import { $getPivotPosition } from "@/controller/application/ReferenceSetting/ReferenceSettingUtil";

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

    const position = {
        "x": 0,
        "y": 0
    };

    if (movie_clip.isSingleSelectedOfDisplayObject()) {
        const layer = movie_clip.getLayer(
            movie_clip.selectedDepths.keys().next().value as number
        );
        if (!layer) {
            return null;
        }

        const values = movie_clip.selectedDepths.values().next().value as number[];
        const character = layer.getCharacter(movie_clip.currentFrame, values[0]);
        if (!character) {
            return null;
        }

        position.x = character.referencePosition.x;
        position.y = character.referencePosition.y;
    } else {

        const bounds = screenAreaCalcSelectedBoundsService(movie_clip, true);
        if (!bounds) {
            return null;
        }

        const width  = Math.abs(bounds.xMax - bounds.xMin);
        const height = Math.abs(bounds.yMax - bounds.yMin);

        const pivotPosition = $getPivotPosition(
            referenceSetting.multiPivot, width, height
        );
        position.x = pivotPosition.x;
        position.y = pivotPosition.y;

        position.x += bounds.xMin;
        position.y += bounds.yMin;

        position.x += referenceSetting.movementX;
        position.y += referenceSetting.movementY;
    }

    return position;
};