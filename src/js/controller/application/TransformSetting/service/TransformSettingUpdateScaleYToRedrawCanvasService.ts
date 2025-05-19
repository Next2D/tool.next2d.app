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
            const afterScaleY = character.scaleY;
            const afterY = character.y;

            // 変更前の値に戻す
            const beforeMatrix = transformSetting.matrixs[index++];
            const beforeScaleY = Math.sqrt(
                beforeMatrix[2] * beforeMatrix[2]
                + beforeMatrix[3] * beforeMatrix[3]
            );

            character.y      = beforeMatrix[4];
            character.scaleY = beforeScaleY;

            const instance = workSpace.getLibrary(character.libraryId);
            if (!instance) {
                continue;
            }

            // 変更前の高さをセット
            const height = character.height;

            let canvas  = null;
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
            await externalCharacter.setScaleY(afterScaleY);
            await externalCharacter.setY(afterY);

            if (canvas) {
                canvas.style.height = `${Math.ceil(height * workSpace.scale)}px`;
            }
        }
    }
};