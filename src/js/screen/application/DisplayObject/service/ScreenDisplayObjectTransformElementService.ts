import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";
import { referenceSetting } from "@/controller/domain/model/ReferenceSetting";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { Matrix } from "@next2d/geom";
import {
    $createTransformStyle,
    $multiplicationMatrix
} from "@/controller/application/TransformSetting/TransformSettingUtil";

/**
 * @description スクリーンで選択中のElementをmatrixに合わせて変形させる
 *              Transform the selected Element on the screen according to the matrix
 *
 * @param  {number} scale_x
 * @return {void}
 * @method
 * @public
 */
export const execute = (scale_x: number): void =>
{
    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    // 選択中のelementがない場合は何もしない
    if (!movieClip.selectedDepths.size) {
        return ;
    }

    const element: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_AREA_ID);

    if (!element) {
        return ;
    }

    // TODO 拡大縮小
    const concatenatedMatrix = [1, 0, 0, 1, 0, 0];
    const offsetX = 0;
    const offsetY = 0;

    const baseMatrix = new Matrix(
        concatenatedMatrix[0], concatenatedMatrix[1],
        concatenatedMatrix[2], concatenatedMatrix[3],
        concatenatedMatrix[4] - offsetX,
        concatenatedMatrix[5] - offsetY
    );
    baseMatrix.invert();

    // global to local
    const referenceX = referenceSetting.x * baseMatrix.a + referenceSetting.y * baseMatrix.c + baseMatrix.tx;
    const referenceY = referenceSetting.x * baseMatrix.b + referenceSetting.y * baseMatrix.d + baseMatrix.ty;

    const parentMatrix = $multiplicationMatrix(
        [scale_x, 0, 0, 1, 0, 0],
        [
            1, 0, 0, 1,
            -referenceX,
            -referenceY
        ]
    );

    // 選択中のElementを移動
    const frame = movieClip.currentFrame;
    for (const [layerIndex, depths] of movieClip.selectedDepths) {

        const layer = movieClip.getLayer(layerIndex);
        if (!layer) {
            continue ;
        }

        // 選択中のElementを取得して移動
        const elements = element.querySelectorAll(`.layer-id-${layer.id}`);
        for (let idx = 0; idx < depths.length; ++idx) {

            const node = elements[depths[idx]] as HTMLElement;
            if (!node) {
                continue ;
            }

            const character = layer.getCharacter(frame, depths[idx]);
            if (!character) {
                continue ;
            }

            // 中心点に合わせて変形
            const multiMatrix = $multiplicationMatrix(
                parentMatrix, character.matrix
            );

            character.matrix[0] = multiMatrix[0];
            character.matrix[1] = multiMatrix[1];
            character.matrix[2] = multiMatrix[2];
            character.matrix[3] = multiMatrix[3];
            character.matrix[4] = multiMatrix[4] + referenceX;
            character.matrix[5] = multiMatrix[5] + referenceY;

            const transform = $createTransformStyle(character);
            if (transform) {
                node.style.transform = transform;
            }
            node.style.left = `${character.x}px`;
            node.style.top  = `${character.y}px`;
        }
    }
};