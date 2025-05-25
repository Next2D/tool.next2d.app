import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description 選択中のDisplayObjectを変更前のmatrixに戻す
 *              Restore the selected DisplayObject to the matrix before changing
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;
    if (!movieClip.selectedDepths.size) {
        return ;
    }

    let index = 0;
    const frame = movieClip.currentFrame;
    for (const [layerIndex, depths] of movieClip.selectedDepths) {
        const layer = movieClip.getLayer(layerIndex);
        if (!layer) {
            continue;
        }

        for (let idx = 0; idx < depths.length; idx++) {
            const depth = depths[idx];

            const character = layer.getCharacter(frame, depth);
            if (!character) {
                continue;
            }

            // 変更前の値に戻す
            const beforeMatrix = transformSetting.matrixs[index++];
            if (!beforeMatrix) {
                continue;
            }

            const beforeScaleX = Math.round(Math.sqrt(
                beforeMatrix[0] * beforeMatrix[0]
                + beforeMatrix[1] * beforeMatrix[1]
            ) * 10000) / 10000;
            const beforeScaleY = Math.round(Math.sqrt(
                beforeMatrix[2] * beforeMatrix[2]
                + beforeMatrix[3] * beforeMatrix[3]
            ) * 10000) / 10000;

            character.x      = beforeMatrix[4];
            character.y      = beforeMatrix[5];
            character.scaleX = beforeMatrix[0] > 0 ? beforeScaleX : beforeScaleX * -1;
            character.scaleY = beforeMatrix[3] > 0 ? beforeScaleY : beforeScaleY * -1;
        }
    }

    transformSetting.scaleX = 1;
    transformSetting.scaleY = 1;
    if (transformSetting.matrixs.length === 1) {
        const matrix = transformSetting.matrixs[0];
        const scaleX = Math.round(Math.sqrt(
            matrix[0] * matrix[0]
            + matrix[1] * matrix[1]
        ) * 10000) / 10000;
        const scaleY = Math.round(Math.sqrt(
            matrix[2] * matrix[2]
            + matrix[3] * matrix[3]
        ) * 10000) / 10000;
        transformSetting.scaleX = matrix[0] > 0 ? scaleX : scaleX * -1;
        transformSetting.scaleY = matrix[3] > 0 ? scaleY : scaleY * -1;
    }
};