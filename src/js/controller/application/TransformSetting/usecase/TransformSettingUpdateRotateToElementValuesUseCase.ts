import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";
import { execute as screenAreaGetElementFromLayerIdAndDepthService } from "@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService";
import { execute as screenAreaCalcSelectedBoundsService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService";
import { referenceSetting } from "@/controller/domain/model/ReferenceSetting";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as characterCalcGetRotationService } from "@/core/application/Character/service/CharacterCalcGetRotationService";
import { execute as transformSettingUpdateXElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateXElementService";
import { execute as transformSettingUpdateYElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateYElementService";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import {
    $createTransformElementStyle,
    $multiplicationMatrix
} from "@/controller/application/TransformSetting/TransformSettingUtil";
import {
    $BITMAP_TYPE,
    $VIDEO_TYPE
} from "@/config/InstanceConfig";
import {
    $getScreenOffsetLeft,
    $getScreenOffsetTop
} from "@/global/GlobalUtil";

/**
 * @description スクリーンで選択中のElementをmatrixに合わせて変形させる
 *              Transform the selected Element on the screen according to the matrix
 *
 * @param  {number} rotation
 * @return {void}
 * @method
 * @public
 */
export const execute = (rotation: number): void =>
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

    const bounds = screenAreaCalcSelectedBoundsService(movieClip);
    if (!bounds) {
        return ;
    }

    const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
    if (rotation !== 0) {
        const radian = rotation * (Math.PI / 180);
        const cos = Math.cos(radian);
        const sin = Math.sin(radian);
        matrix.set([cos, sin, -sin, cos, 0, 0]);
    }

    const parentMatrix = $multiplicationMatrix(
        matrix,
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
            character.rotation = 0;
            const multiMatrix = $multiplicationMatrix(
                parentMatrix, character.matrix
            );

            const tMatrix = $multiplicationMatrix(
                new Float32Array([1, 0, 0, 1, referenceSetting.x, referenceSetting.y]),
                multiMatrix
            );

            character.x = tMatrix[4];
            character.y = tMatrix[5];

            character.rotation = characterCalcGetRotationService(multiMatrix);
            switch (instance.type) {

                case $BITMAP_TYPE:
                case $VIDEO_TYPE:
                    {
                        const transform = $createTransformElementStyle(character, workSpace);
                        if (transform) {
                            node.style.transform = transform.replace(/transform: /, "").replace(";", "");
                            // node.style.transformOrigin = `${character.referencePosition.x}px ${character.referencePosition.y}px`;
                        }
                    }
                    break;

                default:
                    {
                        const canvas = node.querySelector("canvas");
                        if (!canvas) {
                            continue ;
                        }

                        // const beforeValue  = transformSetting.beforeScaleX;
                        // const currentValue = transformSetting.scaleX * scale_x;
                        // const transform = $createMoveTransformElementStyle(
                        //     character, workSpace,
                        //     canvas.clientWidth, canvas.clientHeight,
                        //     currentValue / beforeValue,
                        //     transformSetting.scaleY / transformSetting.beforeScaleY
                        // );
                        // if (!transform) {
                        //     continue;
                        // }

                        // canvas.style.transform = transform;
                    }
                    break;

            }

            // 変形エリアのx座標を更新
            // const x = $getScreenOffsetLeft() + character.globalMinX;
            // node.style.left = `${x}px`;
            // const y = $getScreenOffsetTop() + character.globalMinY;
            // node.style.top = `${y}px`;

            if (movieClip.isSingleSelectedOfDisplayObject()) {
                transformSettingUpdateXElementService(character.x);
                transformSettingUpdateYElementService(character.y);
            }
        }
    }

    transformSetting.rotation = rotation;
    // // 変形エリアのx座標を更新
    // if (!movieClip.isSingleSelectedOfDisplayObject() && bounds) {
    //     transformSettingUpdateWidthElementService(
    //         parseFloat(Math.abs(bounds.xMax - bounds.xMin).toFixed(2))
    //     );
    //     transformSettingUpdateXElementService(bounds.xMin);
    // }

    // 変形エリアのxスケールを更新
    // transformSetting.scaleX *= scale_x;
    // transformSettingUpdateScaleXElementService(
    //     Math.round(transformSetting.scaleX * 10000) / 100
    // );
};