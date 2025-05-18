import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description 選択中のDisplayObjectの変更前のmatrixを格納する
 *              Store the matrix before changing the selected DisplayObject
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 初期化
    transformSetting.matrixs.length = 0;

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;
    if (!movieClip.selectedDepths.size) {
        return ;
    }

    // 変更前のmatrixを格納
    const frame = movieClip.currentFrame;
    for (const [layerIndex, depths] of movieClip.selectedDepths) {
        const layer = movieClip.getLayer(layerIndex);
        if (!layer) {
            continue;
        }

        for (let idx = 0; idx < depths.length; idx++) {
            const character = layer.getCharacter(frame, depths[idx]);
            if (!character) {
                continue;
            }

            // 複製を格納
            transformSetting.matrixs.push(character.matrix.slice());
        }
    }

    transformSetting.scaleX = 1;
    if (transformSetting.matrixs.length === 1) {
        const matrix = transformSetting.matrixs[0];
        transformSetting.scaleX = Math.sqrt(
            matrix[0] * matrix[0]
            + matrix[1] * matrix[1]
        );
    }
};