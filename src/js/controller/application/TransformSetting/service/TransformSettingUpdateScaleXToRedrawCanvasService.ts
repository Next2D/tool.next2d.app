import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalCharacter } from "@/external/core/domain/model/ExternalCharacter";
import { execute as screenAreaGetElementFromLayerIdAndDepthService } from "@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService";
import {
    $BITMAP_TYPE,
    $VIDEO_TYPE
} from "@/config/InstanceConfig";

/**
 * @description スケールxの操作によるキャンバスの再描画
 *              Redraw canvas by scale x operation
 *
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;
    if (movieClip.selectedDepths.size) {
        return ;
    }

    const element: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_AREA_ID);

    if (element) {
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
            const afterScaleX = character.scaleX;
            const afterX = character.x;

            // 変更前の値に戻す
            const beforeMatrix = transformSetting.matrixs[index++];
            const beforeScaleX = Math.sqrt(
                beforeMatrix[0] * beforeMatrix[0]
                + beforeMatrix[1] * beforeMatrix[1]
            );

            character.x      = beforeMatrix[4];
            character.scaleX = beforeScaleX;

            const instance = workSpace.getLibrary(character.libraryId);
            if (!instance) {
                continue;
            }

            let canvas  = null;
            const width = character.width;
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
            await externalCharacter.setScaleX(afterScaleX);
            await externalCharacter.setX(afterX);

            if (canvas) {
                canvas.style.width = `${Math.ceil(width * workSpace.scale)}px`;
            }
        }
    }
};