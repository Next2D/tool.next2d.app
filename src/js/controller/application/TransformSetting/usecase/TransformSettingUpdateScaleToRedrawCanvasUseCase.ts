import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalCharacter } from "@/external/core/domain/model/ExternalCharacter";
import { execute as screenAreaGetElementFromLayerIdAndDepthService } from "@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService";
import { execute as screenAreaReplaceCanvasUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaReplaceCanvasUseCase";

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
            const afterScaleX = character.scaleX;
            const afterScaleY = character.scaleY;
            const afterX = character.x;
            const afterY = character.y;

            // 変更前の値に戻す
            const beforeMatrix = transformSetting.matrixs[index++];
            if (!beforeMatrix) {
                continue;
            }

            character.matrix.set(beforeMatrix);

            const externalCharacter = new ExternalCharacter(
                workSpace,
                movieClip,
                layer,
                character
            );

            await externalCharacter.setScaleX(afterScaleX);
            await externalCharacter.setX(afterX);
            await externalCharacter.setScaleY(afterScaleY);
            await externalCharacter.setY(afterY);

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
        }
    }
};