import { colorSetting } from "@/controller/domain/model/ColorSetting";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalCharacter } from "@/external/core/domain/model/ExternalCharacter";

/**
 * @description スクリーンで選択中のElementのred offsetを更新する
 *              Update the red offset of the selected Element on the screen
 *
 * @param  {number} red
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (red: number): Promise<void> =>
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

    // redを更新前の値に戻す
    character.colorTransform[4] = colorSetting.beforeValue;

    // redを更新
    const externalCharacter = new ExternalCharacter(
        workSpace,
        movieClip,
        layer,
        character
    );
    await externalCharacter.setRedOffset(red);
};