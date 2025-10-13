import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $setSelectedMode } from "../PropertyAreaUtil";
import { execute as propertyAreaBitmapDisplayControllerUseCase } from "./PropertyAreaBitmapDisplayControllerUseCase";
import { execute as propertyAreaVideoDisplayControllerUseCase } from "./PropertyAreaVideoDisplayControllerUseCase";
import { execute as propertyAreaShapeDisplayControllerUseCase } from "./PropertyAreaShapeDisplayControllerUseCase";
import { execute as propertyAreaMovieClipDisplayControllerUseCase } from "./PropertyAreaMovieClipDisplayControllerUseCase";
import { execute as propertyAreaShowMultiSettingUseCase } from "./PropertyAreaShowMultiSettingUseCase";
import { execute as propertyAreaScrollUpdateHeightService } from "@/controller/application/PropertyAreaScroll/service/PropertyAreaScrollUpdateHeightService";
import { execute as propertyAreaShowDefaultSettingItemUseCase } from "./PropertyAreaShowDefaultSettingItemUseCase";
import { execute as transformSettingUpdateElementUseCase } from "@/controller/application/TransformSetting/usecase/TransformSettingUpdateElementUseCase";
import { execute as screenAreaCalcSelectedBoundsService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService";
import {
    $BITMAP_TYPE,
    $MOVIE_CLIP_TYPE,
    $SHAPE_TYPE,
    $VIDEO_TYPE
} from "@/config/InstanceConfig";

/**
 * @description プロパティエリアの表示を更新
 *              Update the display of the property area
 *
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    if (!movieClip.selectedDepths.size) {
        await propertyAreaShowDefaultSettingItemUseCase(movieClip);
        return ;
    }

    // 単体選択処理
    if (movieClip.isSingleSelectedOfDisplayObject()) {

        const layer = movieClip.getLayer(
            movieClip.selectedDepths.keys().next().value as number
        );
        if (!layer || layer.lock || layer.disable) {
            return ;
        }

        const values = movieClip.selectedDepths.values().next().value as number[];
        const character = layer.getCharacter(movieClip.currentFrame, values[0]);

        if (!character) {
            return ;
        }

        const instance = workSpace.getLibrary(character.libraryId);
        if (!instance) {
            return ;
        }

        $setSelectedMode("single");
        switch (instance.type) {

            case $BITMAP_TYPE:
                propertyAreaBitmapDisplayControllerUseCase(character);
                break;

            case $MOVIE_CLIP_TYPE:
                propertyAreaMovieClipDisplayControllerUseCase(character);
                break;

            case $SHAPE_TYPE:
                propertyAreaShapeDisplayControllerUseCase(character);
                break;

            case $VIDEO_TYPE:
                propertyAreaVideoDisplayControllerUseCase(character);
                break;

                // todo text

            default:
                break;

        }
    } else {
        // 複数選択時の表示に切り替える
        propertyAreaShowMultiSettingUseCase();

        // 変形エリアのサイズを更新
        const bounds = screenAreaCalcSelectedBoundsService(movieClip);
        if (bounds) {
            transformSettingUpdateElementUseCase(
                bounds.xMin,
                bounds.yMin,
                Math.abs(bounds.xMax - bounds.xMin),
                Math.abs(bounds.yMax - bounds.yMin),
                1, 1, 0
            );
        }
    }

    // プロパティエリアのスクロールの高さを更新
    propertyAreaScrollUpdateHeightService();
};