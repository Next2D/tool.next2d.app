import { $BITMAP_TYPE } from "@/config/InstanceConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as propertyAreaBitmapDisplayControllerUseCase } from "./PropertyAreaBitmapDisplayControllerUseCase";
import { execute as propertyAreaShowMultiSettingUseCase } from "./PropertyAreaShowMultiSettingUseCase";
import { $setSelectedMode } from "../PropertyAreaUtil";

/**
 * @description プロパティエリアの表示を更新
 *              Update the display of the property area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    if (!movieClip.selectedDepths.size) {
        return ;
    }

    let single = false;
    if (movieClip.selectedDepths.size === 1) {
        const depths = movieClip.selectedDepths.values().next().value;
        if (depths.length === 1) {
            single = true;
        }
    }

    // 単体選択処理
    if (single) {
        const layer = movieClip.getLayer(movieClip.selectedDepths.keys().next().value);
        if (!layer) {
            return ;
        }

        const activeCharacters = layer.getActiveCharacters(movieClip.currentFrame);
        const depth = movieClip.selectedDepths.values().next().value[0];
        const character = activeCharacters[depth];

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

        }
    } else {
        // 複数選択時の表示に切り替える
        propertyAreaShowMultiSettingUseCase();
    }
};