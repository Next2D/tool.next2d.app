import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalCharacter } from "@/external/core/domain/model/ExternalCharacter";
import { execute as screenAreaGetElementFromLayerIdAndDepthService } from "@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService";
import {
    $BITMAP_TYPE,
    $VIDEO_TYPE
} from "@/config/InstanceConfig";

/**
 * @description スケールyの操作によるキャンバスの再描画
 *              Redraw canvas by scale y operation
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
            const beforeScaleY = Math.sqrt(
                beforeMatrix[2] * beforeMatrix[2]
                + beforeMatrix[3] * beforeMatrix[3]
            );

            character.y      = beforeMatrix[5];
            character.scaleY = beforeScaleY;

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
            const afterScaleY = Math.round(Math.sqrt(
                afterMatrix[2] * afterMatrix[2]
                + afterMatrix[3] * afterMatrix[3]
            ) * 10000) / 10000;

            await externalCharacter.setScaleY(afterScaleY);
            await externalCharacter.setY(afterMatrix[5]);

            if (canvas) {
                canvas.style.width  = `${Math.ceil(canvas.width  / window.devicePixelRatio)}px`;
                canvas.style.height = `${Math.ceil(canvas.height / window.devicePixelRatio)}px`;
            }
        }
    }
};