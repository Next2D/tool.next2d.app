import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { IPosition } from "@/interface/IPosition";
import { referenceSetting } from "@/controller/domain/model/ReferenceSetting";
import { execute as screenAreaCalcSelectedBoundsService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService";
import { $getConcatenatedMatrix } from "@/controller/application/TransformSetting/TransformSettingUtil";

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
        const bounds = screenAreaCalcSelectedBoundsService(movie_clip);
        if (!bounds) {
            return null;
        }

        let x = 0;
        let y = 0;
        const width  = bounds.xMax - bounds.xMin;
        const height = bounds.yMax - bounds.yMin;
        switch (referenceSetting.pivot) {

            case "top-left":
                x = 0;
                y = 0;
                break;

            case "top-center":
                x = width / 2;
                y = 0;
                break;

            case "top-right":
                x = width;
                y = 0;
                break;

            case "middle-left":
                x = 0;
                y = height / 2;
                break;

            case "middle-center":
                x = width / 2;
                y = height / 2;
                break;

            case "middle-right":
                x = width;
                y = height / 2;
                break;

            case "bottom-left":
                x = 0;
                y = height;
                break;

            case "bottom-center":
                x = width / 2;
                y = height;
                break;

            case "bottom-right":
                x = width;
                y = height;
                break;

            default:
                x = width / 2;
                y = height / 2;
                break;

        }

        const matrix = $getConcatenatedMatrix();
        position.x = x * matrix[0] + y * matrix[2] + matrix[4];
        position.y = y * matrix[1] + y * matrix[3] + matrix[5];

        position.x += bounds.xMin;
        position.y += bounds.yMin;
    }

    return position;
};