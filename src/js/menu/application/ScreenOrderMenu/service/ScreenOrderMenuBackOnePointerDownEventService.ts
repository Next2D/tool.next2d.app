import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $allHideMenu } from "../../MenuUtil";
import { ExternalCharacter } from "@/external/core/domain/model/ExternalCharacter";

/**
 * @description レイヤー内の一つ背面に移動する
 *              Move one to the back in the layer
 *
 * @param  {PointerEvent | KeyboardEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent | KeyboardEvent): Promise<void> =>
{
    // 画面重ね順メニューを非表示にする
    $allHideMenu();

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    if (!movieClip.isSingleSelectedOfDisplayObject()) {
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
    const character = layer.getCharacter(movieClip.currentFrame, values[0]);
    if (!character) {
        return ;
    }

    const externalCharacter = new ExternalCharacter(
        workSpace,
        movieClip,
        layer,
        character
    );

    await externalCharacter.changeDepth(character.depth - 1);
};