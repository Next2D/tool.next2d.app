import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalCharacter } from "@/external/core/domain/model/ExternalCharacter";

/**
 * @description 選択中のDisplayObjectの移動した値を更新
 *              Update the moved value of the selected DisplayObject
 *
 * @param  {boolean} [over_wirte=false]
 * @return {void}
 * @method
 * @public
 */
export const execute = (over_wirte: boolean = false): void =>
{
    // 移動量のオブジェクトを取得
    if (!transformSetting.x && !transformSetting.y) {
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
            if (transformSetting.x) {
                if (over_wirte) {
                    externalCharacter.x = transformSetting.x;
                } else {
                    externalCharacter.x += transformSetting.x;
                }
            }

            // yの移動があれば更新
            if (transformSetting.y) {
                if (over_wirte) {
                    externalCharacter.y = transformSetting.y;
                } else {
                    externalCharacter.y += transformSetting.y;
                }
            }
        }
    }

    // 移動した値を初期化
    transformSetting.x = transformSetting.y = 0;
    transformSetting.tempPosition.x = transformSetting.tempPosition.y = 0;
};