import type { IBlendMode } from "@/interface/IBlendMode";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalCharacter } from "@/external/core/domain/model/ExternalCharacter";

/**
 * @description スクリーンで選択中のElementのblendModeを更新する
 *              Update the blendMode of the selected Element on the screen
 *
 * @param {Event} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: Event): Promise<void> =>
{
    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    if (!movieClip.selectedDepths.size
        || !movieClip.isSingleSelectedOfDisplayObject()
    ) {
        return ;
    }

    // イベントの伝播を停止
    event.stopPropagation();

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

    // blendModeを更新
    const externalCharacter = new ExternalCharacter(
        workSpace,
        movieClip,
        layer,
        character
    );
    await externalCharacter.setBlendMode(
        (event.target as HTMLSelectElement).value as IBlendMode
    );
};