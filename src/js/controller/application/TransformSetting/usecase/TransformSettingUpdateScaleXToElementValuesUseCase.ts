import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";
import { execute as screenAreaGetElementFromLayerIdAndDepthService } from "@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService";
import { execute as screenAreaCalcSelectedBoundsService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService";
import { execute as transformSettingUpdateXElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateXElementService";
import { execute as transformSettingUpdateScaleXElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateScaleXElementService";
import { referenceSetting } from "@/controller/domain/model/ReferenceSetting";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $getScreenOffsetLeft } from "@/global/GlobalUtil";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import {
    $createTransformElementStyle,
    $createMoveTransformElementStyle,
    $multiplicationMatrix
} from "@/controller/application/TransformSetting/TransformSettingUtil";
import {
    $BITMAP_TYPE,
    $VIDEO_TYPE
} from "@/config/InstanceConfig";

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
    if (scale_x === 1) {
        return ;
    }

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

    const bounds = screenAreaCalcSelectedBoundsService(movieClip);
    if (!bounds) {
        return ;
    }

    const parentMatrix = $multiplicationMatrix(
        new Float32Array([scale_x, 0, 0, 1, 0, 0]),
        new Float32Array([1, 0, 0, 1, -referenceSetting.x, -referenceSetting.y])
    );

    // 選択中のElementを移動
    const frame = movieClip.currentFrame;
    for (const [layerIndex, depths] of movieClip.selectedDepths) {

        const layer = movieClip.getLayer(layerIndex);
        if (!layer) {
            continue ;
        }

        // 選択中のElementを取得して移動
        for (let idx = 0; idx < depths.length; ++idx) {

            const depth = depths[idx];

            const node = screenAreaGetElementFromLayerIdAndDepthService(layer.id, depth);
            if (!node) {
                continue ;
            }

            const character = layer.getCharacter(frame, depth);
            if (!character) {
                continue ;
            }

            const instance = workSpace.getLibrary(character.libraryId);
            if (!instance) {
                continue ;
            }

            // 中心点に合わせて変形
            const multiMatrix = $multiplicationMatrix(
                parentMatrix, character.matrix
            );

            const tMatrix = $multiplicationMatrix(
                new Float32Array([1, 0, 0, 1, referenceSetting.x, referenceSetting.y]),
                multiMatrix
            );

            character.x = tMatrix[4];
            character.y = tMatrix[5];

            const scaleX = Math.sqrt(
                multiMatrix[0] * multiMatrix[0]
                + multiMatrix[1] * multiMatrix[1]
            );

            character.scaleX = multiMatrix[0] > 0 ? scaleX : scaleX * -1;
            switch (instance.type) {

                case $BITMAP_TYPE:
                case $VIDEO_TYPE:
                    {
                        const transform = $createTransformElementStyle(character, workSpace);
                        if (transform) {
                            node.style.transform = transform.replace(/transform: /, "").replace(";", "");
                        }
                    }
                    break;

                default:
                    {
                        const canvas = node.querySelector("canvas");
                        if (!canvas) {
                            continue ;
                        }

                        const beforeValue  = transformSetting.beforeScaleX;
                        const currentValue = transformSetting.scaleX * scale_x;
                        const transform = $createMoveTransformElementStyle(
                            character, workSpace,
                            currentValue / beforeValue,
                            transformSetting.scaleY / transformSetting.beforeScaleY
                        );
                        if (!transform) {
                            continue;
                        }

                        canvas.style.transform = transform;
                    }
                    break;

            }

            // 変形エリアのx座標を更新
            const x = $getScreenOffsetLeft() + character.globalMinX;
            node.style.left = `${x}px`;

            if (movieClip.isSingleSelectedOfDisplayObject()) {
                transformSettingUpdateXElementService(character.x);
            }
        }
    }

    // 変形エリアのx座標を更新
    if (!movieClip.isSingleSelectedOfDisplayObject() && bounds) {
        transformSettingUpdateXElementService(bounds.xMin);
    }

    // 変形エリアのxスケールを更新
    transformSetting.scaleX *= scale_x;
    transformSettingUpdateScaleXElementService(
        Math.round(transformSetting.scaleX * 10000) / 100
    );
};