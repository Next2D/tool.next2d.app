import { colorSetting } from "@/controller/domain/model/ColorSetting";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as screenAreaGetElementFromLayerIdAndDepthService } from "@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService";
import { ExternalCharacter } from "@/external/core/domain/model/ExternalCharacter";

/**
 * @description スクリーンで選択中のElementのblue offsetを更新する
 *              Update the blue offset of the selected Element on the screen
 *
 * @param  {number} blue
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (blue: number): Promise<void> =>
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

    // blueを更新前の値に戻す
    character.colorTransform[6] = colorSetting.beforeValue;

    // blueを更新
    const externalCharacter = new ExternalCharacter(
        workSpace,
        movieClip,
        layer,
        character
    );
    await externalCharacter.setBlueOffset(blue);
};