import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalCharacter } from "@/external/core/domain/model/ExternalCharacter";

/**
 * @description サイズ変更操作によるキャンバスの再描画
 *              Redraw canvas by size change operation
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
            const afterWidth  = character.width;
            const afterHeight = character.height;
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

            if (character.rotation) {
                await externalCharacter.setMatrix(
                    afterMatrix[0], afterMatrix[1], afterMatrix[2],
                    afterMatrix[3], afterMatrix[4], afterMatrix[5]
                );
            } else {
                await externalCharacter.setWidth(afterWidth);
                await externalCharacter.setX(afterX);
                await externalCharacter.setHeight(afterHeight);
                await externalCharacter.setY(afterY);
            }
        }
    }
};