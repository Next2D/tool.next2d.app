import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $allHideMenu } from "../../MenuUtil";
import { ExternalCharacter } from "@/external/core/domain/model/ExternalCharacter";

/**
 * @description 前のキーフレームの座標に合わせるイベントを実行
 *              Execute the event to match the coordinates of the previous keyframe
 *
 * @param  {PointerEvent | KeyboardEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent | KeyboardEvent): Promise<void> =>
{
    // メニューを全て閉じる
    $allHideMenu();

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    if (!movieClip.selectedDepths.size) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();

    const frame = movieClip.currentFrame;
    for (const [layerIndex, depths] of movieClip.selectedDepths) {

        const layer = movieClip.getLayer(layerIndex);
        console.log(layer);
        if (!layer) {
            continue;
        }

        // 現フレームの選択中のCharacterを取得
        const activeCharacters = layer.getActiveCharacters(frame);
        if (!activeCharacters.length) {
            continue;
        }
        const activeCharacter = activeCharacters[0];

        // 前のキーフレームのDisplayObjectを取得
        const prevActiveCharacters = layer.getActiveCharacters(activeCharacter.startFrame - 1);
        if (!prevActiveCharacters.length) {
            continue;
        }

        const characters = prevActiveCharacters
            .sort((a, b) => a.depth < b.depth ? -1 : 1);

        const prevCharacter = characters[0];
        const x = prevCharacter.x;
        const y = prevCharacter.y;
        for (let idx = 0; idx < depths.length; idx++) {

            const character = layer.getCharacter(frame, depths[idx]);
            if (!character) {
                continue;
            }

            // 座標を合わせる
            const externalCharacter = new ExternalCharacter(
                workSpace,
                movieClip,
                layer,
                character
            );

            await externalCharacter.setX(x);
            await externalCharacter.setY(y);
        }
    }
};