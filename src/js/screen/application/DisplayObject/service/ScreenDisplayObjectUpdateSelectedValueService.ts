import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalCharacter } from "@/external/core/domain/model/ExternalCharacter";

/**
 * @description 選択中のDisplayObjectの移動した値を更新
 *              Update the moved value of the selected DisplayObject
 *
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    // 現在のフレームをセット
    const frame = movieClip.currentFrame;

    const x = transformSetting.x;
    const y = transformSetting.y;

    // 選択中のDisplayObjectの座標を更新
    let index = 0;
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

            const matrix = transformSetting.matrixs[index++];
            if (!matrix) {
                continue ;
            }

            // 変更前の状態に戻す
            character.matrix.set(matrix);

            // 外部APIを起動
            const externalCharacter = new ExternalCharacter(
                workSpace,
                movieClip,
                layer,
                character
            );

            // xの移動があれば更新
            if (x) {
                await externalCharacter.setX(externalCharacter.getX() + x);
            }

            // yの移動があれば更新
            if (y) {
                await externalCharacter.setY(externalCharacter.getY() + y);
            }
        }
    }
};