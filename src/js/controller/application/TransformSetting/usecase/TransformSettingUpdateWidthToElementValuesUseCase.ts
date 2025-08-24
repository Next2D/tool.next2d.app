import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";
import { execute as screenAreaGetElementFromLayerIdAndDepthService } from "@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService";
import { execute as screenAreaCalcSelectedBoundsService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService";
import { execute as transformSettingUpdateYElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateYElementService";
import { execute as transformSettingUpdateXElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateXElementService";
import { execute as transformSettingUpdateWidthElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateWidthElementService";
import { execute as transformSettingUpdateScaleXElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateScaleXElementService";
import { execute as transformSettingUpdateRotationElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateRotationElementService";
import { referenceSetting } from "@/controller/domain/model/ReferenceSetting";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $getScreenOffsetLeft, $getScreenOffsetTop } from "@/global/GlobalUtil";
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

    // 選択中のElementを移動
    const scale = workSpace.scale;
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

            const rad = character.rotation * Math.PI / 180;
            const parentMatrix = $multiplicationMatrix(
                new Float32Array([1, 0, 0, 1, referenceSetting.x, referenceSetting.y]),
                $multiplicationMatrix(
                    new Float32Array([Math.cos(-rad), Math.sin(-rad), -Math.sin(-rad), Math.cos(-rad), 0, 0]),
                    $multiplicationMatrix(
                        new Float32Array([scale_x, 0, 0, 1, 0, 0]),
                        $multiplicationMatrix(
                            new Float32Array([Math.cos(rad), Math.sin(rad), -Math.sin(rad), Math.cos(rad), 0, 0]),
                            new Float32Array([1, 0, 0, 1, -referenceSetting.x, -referenceSetting.y])
                        )
                    )
                )
            );

            // matrix情報を更新
            character.matrix.set(
                $multiplicationMatrix(character.matrix, parentMatrix)
            );

            const canvas = node.querySelector("canvas");
            switch (instance.type) {

                case $BITMAP_TYPE:
                case $VIDEO_TYPE:
                    {
                        node.style.width  = `${character.width * scale}px`;
                        node.style.height = `${character.height * scale}px`;
                        const container = node.querySelector(".canvas-container") as HTMLDivElement;
                        if (container) {
                            const bounds = character.getRawBounds();
                            if (canvas && bounds) {
                                container.style.width  = canvas.style.width  = `${Math.ceil(Math.abs(bounds.xMax - bounds.xMin) * Math.abs(character.scaleX) * scale)}px`;
                                container.style.height = canvas.style.height = `${Math.ceil(Math.abs(bounds.yMax - bounds.yMin) * Math.abs(character.scaleY) * scale)}px`;
                            }
                            container.style.transform = $createTransformElementStyle(character);
                        }
                    }
                    break;

                default:
                    {
                        if (!canvas) {
                            continue ;
                        }

                        const beforeValue  = transformSetting.beforeScaleY;
                        const currentValue = transformSetting.scaleX * scale_x;
                        const transform = $createMoveTransformElementStyle(
                            character, workSpace,
                            canvas.clientWidth, canvas.clientHeight,
                            transformSetting.scaleX / transformSetting.beforeScaleX,
                            currentValue / beforeValue
                        );

                        canvas.style.transform = transform ? transform : "";
                    }
                    break;

            }

            node.style.left = `${$getScreenOffsetLeft() + character.globalMinX}px`;
            node.style.top  = `${$getScreenOffsetTop()  + character.globalMinY}px`;

            if (movieClip.isSingleSelectedOfDisplayObject()) {
                transformSettingUpdateXElementService(character.x);
                transformSettingUpdateYElementService(character.y);
                transformSetting.w = character.width;
                transformSettingUpdateWidthElementService(character.width);
                transformSettingUpdateRotationElementService(character.rotation);
                transformSettingUpdateScaleXElementService(
                    Math.round(transformSetting.scaleX * 10000) / 100
                );
            }
        }
    }

    // 変形エリアのy座標を更新
    if (!movieClip.isSingleSelectedOfDisplayObject()) {
        const bounds = screenAreaCalcSelectedBoundsService(movieClip);
        if (!bounds) {
            return ;
        }

        if (bounds) {
            transformSettingUpdateXElementService(bounds.xMin);
            transformSettingUpdateYElementService(bounds.yMin);
            transformSetting.w = Math.round(Math.abs(bounds.xMax - bounds.xMin) * 100) / 100;
            transformSettingUpdateWidthElementService(transformSetting.w);
        }
    }

    // 変形エリアのyスケールを更新
    transformSetting.scaleX *= scale_x;
    transformSettingUpdateScaleXElementService(
        Math.round(transformSetting.scaleX * 10000) / 100
    );
};