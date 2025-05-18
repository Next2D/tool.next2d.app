import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";
import { execute as targetRectUpdateElementUseCase } from "@/screen/application/TargetRect/usecase/TargetRectUpdateElementUseCase";
import { execute as screenAreaGetElementFromLayerIdAndDepthService } from "@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService";
import { execute as screenAreaCalcSelectedBoundsService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService";
import { execute as transformSettingUpdateXElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateXElementService";
import { execute as transformSettingUpdateScaleXElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateScaleXElementService";
import { referenceSetting } from "@/controller/domain/model/ReferenceSetting";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $getScreenOffsetLeft } from "@/global/GlobalUtil";
import {
    $createTransformElementStyle,
    $multiplicationMatrix
} from "@/controller/application/TransformSetting/TransformSettingUtil";
import {
    $BITMAP_TYPE,
    $VIDEO_TYPE
} from "@/config/InstanceConfig";
import { transformSetting } from "@/controller/domain/model/TransformSetting";

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

    const parentMatrix = $multiplicationMatrix(
        new Float32Array([scale_x, 0, 0, 1, 0, 0]),
        new Float32Array([
            1, 0, 0, 1,
            -referenceSetting.x,
            -referenceSetting.y
        ])
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

            const node = screenAreaGetElementFromLayerIdAndDepthService(layer.id, depths[idx]);
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

            character.x = multiMatrix[4] + referenceSetting.x;
            character.y = multiMatrix[5] + referenceSetting.y;

            character.scaleX = Math.sqrt(
                multiMatrix[0] * multiMatrix[0]
                + multiMatrix[1] * multiMatrix[1]
            );

            const instance = workSpace.getLibrary(character.libraryId);
            if (!instance) {
                continue ;
            }

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
                        canvas.style.width = `${Math.ceil(character.width * workSpace.scale)}px`;
                    }
                    break;

            }

            const x = $getScreenOffsetLeft() + character.x * workSpace.scale;
            node.style.left = `${x}px`;
        }
    }

    // 選択中のElementのレクタングルを再計算
    targetRectUpdateElementUseCase();

    // 選択範囲のバウンディングボックスを取得
    const bounds = screenAreaCalcSelectedBoundsService(movieClip);

    // 変形エリアのx座標を更新
    if (bounds) {
        transformSettingUpdateXElementService(bounds.xMin);
    }

    // 変形エリアのxスケールを更新
    transformSetting.scaleX *= scale_x;
    transformSettingUpdateScaleXElementService(
        Math.round(transformSetting.scaleX * 10000) / 100
    );
};