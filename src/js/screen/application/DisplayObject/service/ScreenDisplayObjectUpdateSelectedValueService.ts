import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalCharacter } from "@/external/core/domain/model/ExternalCharacter";
import { $getMovePositon } from "@/tool/application/ToolUtil";

/**
 * @description 選択中のDisplayObjectの移動した値を更新
 *              Update the moved value of the selected DisplayObject
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 移動量のオブジェクトを取得
    const movePosition = $getMovePositon();
    if (!movePosition.x && !movePosition.y) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    // 現在のフレームをセット
    const frame = movieClip.currentFrame;

    // 選択中のDisplayObjectの座標を更新
    for (const [layerIndex, depths] of movieClip.selectedDepths) {

        const layer = movieClip.getLayer(layerIndex);
        if (!layer) {
            continue ;
        }

        // 選択中の深度からCharacterを取得
        for (let idx = 0; idx < depths.length; ++idx) {

            const character = layer.getCharacter(frame, depths[idx]);
            if (!character) {
                continue ;
            }

            // 外部APIを起動
            const externalCharacter = new ExternalCharacter(
                workSpace,
                movieClip,
                layer,
                character
            );

            // xの移動があれば更新
            if (movePosition.x) {
                externalCharacter.x += movePosition.x;
            }

            // yの移動があれば更新
            if (movePosition.y) {
                externalCharacter.y += movePosition.y;
            }
        }
    }

    // 移動した値を初期化
    movePosition.x = movePosition.y = 0;
};