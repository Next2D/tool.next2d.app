import { colorSetting } from "@/controller/domain/model/ColorSetting";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as screenAreaGetElementFromLayerIdAndDepthService } from "@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService";
import { ExternalCharacter } from "@/external/core/domain/model/ExternalCharacter";

/**
 * @description スクリーンで選択中のElementのalphaを更新する
 *              Update the alpha of the selected Element on the screen
 *
 * @param {number} alpha
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (alpha: number): Promise<void> =>
{
    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    // 選択中のelementがない場合は何もしない
    if (!movieClip.selectedDepths.size) {
        return ;
    }

    const layer = movieClip.getLayer(
        movieClip.selectedDepths.keys().next().value as number
    );
    if (!layer) {
        return ;
    }

    const values = movieClip.selectedDepths.values().next().value as number[];

    const depth = values[0];
    const character = layer.getCharacter(movieClip.currentFrame, depth);
    if (!character) {
        return ;
    }

    const node = screenAreaGetElementFromLayerIdAndDepthService(layer.id, depth);
    if (!node) {
        return ;
    }

    // alphaを更新前の値に戻す
    character.colorTransform[3] = colorSetting.beforeValue / 100;

    // alphaを更新
    const externalCharacter = new ExternalCharacter(
        workSpace,
        movieClip,
        layer,
        character
    );
    await externalCharacter.setAlphaMultiplier(alpha);
};