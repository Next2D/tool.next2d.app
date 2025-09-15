import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";
import { execute as screenAreaGetElementFromLayerIdAndDepthService } from "@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService";
import { execute as screenAreaCalcSelectedBoundsService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService";
import { execute as transformSettingUpdateXElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateXElementService";
import { execute as transformSettingUpdateYElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateYElementService";
import { execute as transformSettingUpdateWidthElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateWidthElementService";
import { execute as transformSettingUpdateHeightElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateHeightElementService";
import { execute as transformSettingUpdateScaleXElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateScaleXElementService";
import { execute as transformSettingUpdateScaleYElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateScaleYElementService";
import { execute as referencePositionGetGlobalPositionUseCase } from "@/core/application/ReferencePosition/usecase/ReferencePositionGetGlobalPositionUseCase";
import { Matrix } from "@next2d/geom";
import {
    $getCurrentWorkSpace,
    $getMatrixBounds
} from "@/core/application/CoreUtil";
import {
    $createTransformElementStyle,
    $getConcatenatedMatrix
} from "@/controller/application/TransformSetting/TransformSettingUtil";
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
    if (!rotation) {
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

    // 中心点のグルーバル座標を取得
    const position = referencePositionGetGlobalPositionUseCase(movieClip);
    if (!position) {
        return ;
    }

    const radian = rotation * Math.PI / 180;
    const cos = Math.cos(radian);
    const sin = Math.sin(radian);
    const baseMatrix = new Float32Array([cos, sin, -sin, cos, 0, 0]);

    // 選択中のElementを移動
    const concatenatedMatrix = $getConcatenatedMatrix();
    const scaleX = Math.hypot(concatenatedMatrix[0], concatenatedMatrix[1]);
    const scaleY = Math.hypot(concatenatedMatrix[2], concatenatedMatrix[3]);
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

            const transformedMatrix = Matrix.multiply(
                concatenatedMatrix,
                character.matrix
            );

            const matrix = new Matrix(...transformedMatrix);
            matrix.invert();

            const localX = position.x * matrix.a + position.y * matrix.c + matrix.tx;
            const localY = position.x * matrix.b + position.y * matrix.d + matrix.ty;

            const prevX = character.matrix[0] * localX + character.matrix[2] * localY + character.matrix[4];
            const prevY = character.matrix[1] * localX + character.matrix[3] * localY + character.matrix[5];

            const multiMatrix = Matrix.multiply(
                baseMatrix, character.matrix
            );

            const radian = Math.atan2(multiMatrix[1], multiMatrix[0]);
            let rotation = Math.round(radian * 180 / Math.PI);
            if (rotation < 0) {
                rotation += 360;
            }

            character.rotation = rotation;

            const nextX = character.matrix[0] * localX + character.matrix[2] * localY;
            const nextY = character.matrix[1] * localX + character.matrix[3] * localY;
            character.x = prevX - nextX;
            character.y = prevY - nextY;

            const canvas = node.querySelector("canvas");
            const matrixBounds = $getMatrixBounds(
                0, 0,
                character.width,
                character.height,
                concatenatedMatrix
            );

            node.style.width  = `${Math.abs(matrixBounds.xMax - matrixBounds.xMin)}px`;
            node.style.height = `${Math.abs(matrixBounds.yMax - matrixBounds.yMin)}px`;
            const container = node.querySelector(".canvas-container") as HTMLDivElement;
            if (container) {
                const bounds = character.getRawBounds();
                if (canvas && bounds) {
                    container.style.width  = canvas.style.width  = `${Math.ceil(Math.abs((bounds.xMax - bounds.xMin) * character.scaleX * scaleX))}px`;
                    container.style.height = canvas.style.height = `${Math.ceil(Math.abs((bounds.yMax - bounds.yMin) * character.scaleY * scaleY))}px`;
                }
                container.style.transform = $createTransformElementStyle(character);
            }

            // 変形エリアのx座標を更新
            node.style.left = `${$getScreenOffsetLeft() + character.globalMinX}px`;
            node.style.top  = `${$getScreenOffsetTop()  + character.globalMinY}px`;

            if (movieClip.isSingleSelectedOfDisplayObject()) {
                transformSettingUpdateXElementService(character.x);
                transformSettingUpdateYElementService(character.y);
                transformSettingUpdateWidthElementService(character.width);
                transformSettingUpdateHeightElementService(character.height);
                transformSettingUpdateScaleXElementService(
                    Math.round(character.scaleX * 10000) / 100
                );
                transformSettingUpdateScaleYElementService(
                    Math.round(character.scaleY * 10000) / 100
                );
            }
        }
    }

    // 変形エリアのx座標を更新
    // TODO
    if (!movieClip.isSingleSelectedOfDisplayObject()) {
        const bounds = screenAreaCalcSelectedBoundsService(movieClip);
        if (bounds) {
            transformSettingUpdateWidthElementService(
                Math.round(Math.abs(bounds.xMax - bounds.xMin) * 100) / 100
            );
            transformSettingUpdateXElementService(bounds.xMin);
            transformSettingUpdateYElementService(bounds.yMin);
        }
    }
};