import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";
import { execute as screenAreaGetElementFromLayerIdAndDepthService } from "@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService";
import { execute as screenAreaCalcSelectedBoundsService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService";
import { execute as transformSettingUpdateYElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateYElementService";
import { execute as transformSettingUpdateHeightElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateHeightElementService";
import { execute as transformSettingUpdateScaleYElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateScaleYElementService";
import { referenceSetting } from "@/controller/domain/model/ReferenceSetting";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $getScreenOffsetTop } from "@/global/GlobalUtil";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import {
    $createMoveTransformElementStyle,
    $createTransformElementStyle,
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
 * @param  {number} scale_y
 * @return {void}
 * @method
 * @public
 */
export const execute = (scale_y: number): void =>
{
    if (scale_y === 1) {
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
        new Float32Array([1, 0, 0, scale_y, 0, 0]),
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

            character.x = multiMatrix[4] + referenceSetting.x;
            character.y = multiMatrix[5] + referenceSetting.y;

            const scaleY = Math.sqrt(
                multiMatrix[2] * multiMatrix[2]
                + multiMatrix[3] * multiMatrix[3]
            );

            character.scaleY = multiMatrix[3] > 0 ? scaleY : scaleY * -1;
            switch (instance.type) {

                case $BITMAP_TYPE:
                case $VIDEO_TYPE:
                    {
                        const transform = $createTransformElementStyle(character, workSpace);
                        if (transform) {
                            node.style.transform = transform.replace(/transform: /g, "").replace(";", "");
                        }
                    }
                    break;

                default:
                    {
                        const canvas = node.querySelector("canvas");
                        if (!canvas) {
                            continue ;
                        }

                        const beforeValue  = transformSetting.beforeScaleY;
                        const currentValue = transformSetting.scaleY * scale_y;
                        const transform = $createMoveTransformElementStyle(
                            character, workSpace,
                            canvas.clientWidth, canvas.clientHeight,
                            transformSetting.scaleX / transformSetting.beforeScaleX,
                            currentValue / beforeValue
                        );
                        if (!transform) {
                            continue;
                        }

                        canvas.style.transform = transform;
                    }
                    break;

            }

            const y = $getScreenOffsetTop() + character.globalMinY;
            node.style.top = `${y}px`;

            if (movieClip.isSingleSelectedOfDisplayObject()) {
                transformSettingUpdateHeightElementService(character.height);
                transformSettingUpdateYElementService(character.y);
            }
        }
    }

    // 変形エリアのy座標を更新
    if (!movieClip.isSingleSelectedOfDisplayObject() && bounds) {
        transformSettingUpdateHeightElementService(
            parseFloat(Math.abs(bounds.yMax - bounds.yMin).toFixed(2))
        );
        transformSettingUpdateYElementService(bounds.yMin);
    }

    // 変形エリアのyスケールを更新
    transformSetting.scaleY *= scale_y;
    transformSettingUpdateScaleYElementService(
        Math.round(transformSetting.scaleY * 10000) / 100
    );
};