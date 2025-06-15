import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalCharacter } from "@/external/core/domain/model/ExternalCharacter";
import { execute as screenAreaGetElementFromLayerIdAndDepthService } from "@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService";
import { execute as screenAreaReplaceCanvasUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaReplaceCanvasUseCase";
import {
    $BITMAP_TYPE,
    $VIDEO_TYPE
} from "@/config/InstanceConfig";

/**
 * @description スケールの操作によるキャンバスの再描画
 *              Redraw canvas by scale operation
 *
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
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

            // 変更後の値をセット
            const afterMatrix = character.matrix.slice();

            // 変更前の値に戻す
            const beforeMatrix = transformSetting.matrixs[index++];
            if (!beforeMatrix) {
                continue;
            }

            const beforeScaleX = Math.sqrt(
                beforeMatrix[0] * beforeMatrix[0]
                + beforeMatrix[1] * beforeMatrix[1]
            );
            const beforeScaleY = Math.sqrt(
                beforeMatrix[2] * beforeMatrix[2]
                + beforeMatrix[3] * beforeMatrix[3]
            );

            character.x      = beforeMatrix[4];
            character.y      = beforeMatrix[5];
            character.scaleX = beforeMatrix[0] > 0 ? beforeScaleX : beforeScaleX * -1;
            character.scaleY = beforeMatrix[3] > 0 ? beforeScaleY : beforeScaleY * -1;

            const instance = workSpace.getLibrary(character.libraryId);
            if (!instance) {
                continue;
            }

            // 変更中のcanvasを取得
            let canvas = null;
            if (instance.type !== $BITMAP_TYPE && instance.type !== $VIDEO_TYPE) {
                const node = screenAreaGetElementFromLayerIdAndDepthService(layer.id, character.depth);
                if (node) {
                    canvas = node.querySelector("canvas");
                }
            }

            const externalCharacter = new ExternalCharacter(
                workSpace,
                movieClip,
                layer,
                character
            );

            // fixed logic
            const afterScaleX = Math.round(Math.sqrt(
                afterMatrix[0] * afterMatrix[0]
                + afterMatrix[1] * afterMatrix[1]
            ) * 10000) / 10000;
            const afterScaleY = Math.round(Math.sqrt(
                afterMatrix[2] * afterMatrix[2]
                + afterMatrix[3] * afterMatrix[3]
            ) * 10000) / 10000;

            await externalCharacter.setScaleX(afterMatrix[0] > 0 ? afterScaleX : afterScaleX * -1);
            await externalCharacter.setX(afterMatrix[4]);
            await externalCharacter.setScaleY(afterMatrix[3] > 0 ? afterScaleY : afterScaleY * -1);
            await externalCharacter.setY(afterMatrix[5]);

            // 固定時はこのタイミングでcanvasを入れ替える
            if (transformSetting.sizeLocked
                || transformSetting.scaleLocked
            ) {
                const element = screenAreaGetElementFromLayerIdAndDepthService(layer.id, character.depth);
                if (element) {
                    await screenAreaReplaceCanvasUseCase(
                        character,
                        element,
                        layer
                    );
                }
            }

            // 変更元のcanvasを元のサイズに戻す
            if (canvas) {
                canvas.style.transform = "";
            }
        }
    }
};