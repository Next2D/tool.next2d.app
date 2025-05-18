import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalCharacter } from "@/external/core/domain/model/ExternalCharacter";

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

        const element: HTMLElement | null = document
            .getElementById($SCREEN_STAGE_AREA_ID);

        if (element) {

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
                    const scaleX = character.scaleX;
                    const x = character.x;

                    // 変更前の値に戻す
                    const beforeMatrix = transformSetting.matrixs[index++];
                    const beforeScaleX = Math.sqrt(
                        beforeMatrix[0] * beforeMatrix[0]
                        + beforeMatrix[1] * beforeMatrix[1]
                    );

                    character.x      = beforeMatrix[4];
                    character.scaleX = beforeScaleX;

                    const externalCharacter = new ExternalCharacter(
                        workSpace,
                        movieClip,
                        layer,
                        character
                    );

                    // fixed logic
                    await externalCharacter.setScaleX(scaleX);
                    await externalCharacter.setX(x);
                }
            }
        }
    }
};