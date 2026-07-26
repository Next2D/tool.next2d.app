import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";
import { execute as screenAreaGetElementFromLayerIdAndDepthService } from "@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService";
import { execute as screenAreaCalcSelectedBoundsService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService";
import { execute as transformSettingUpdateYElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateYElementService";
import { execute as transformSettingUpdateXElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateXElementService";
import { execute as transformSettingUpdateWidthElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateWidthElementService";
import { execute as transformSettingUpdateScaleXElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateScaleXElementService";
import { execute as transformSettingUpdateScaleYElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateScaleYElementService";
import { execute as transformSettingUpdateRotationElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateRotationElementService";
import { execute as screenStandardPointDeployElementUseCase } from "@/screen/application/StandardPoint/usecase/ScreenStandardPointDeployElementUseCase";
import { execute as screenDisplayObjectUpdateMaskInCanvasStyleService } from "@/screen/application/DisplayObject/service/ScreenDisplayObjectUpdateMaskInCanvasStyleService";
import { execute as transformSettingUpdateElementSizeService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateElementSizeService";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { referenceSetting } from "@/controller/domain/model/ReferenceSetting";
import { Matrix } from "@next2d/geom";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import {
    $getScreenOffsetLeft,
    $getScreenOffsetTop
} from "@/global/GlobalUtil";
import {
    $createTransformElementStyle,
    $getConcatenatedMatrix
} from "@/controller/application/TransformSetting/TransformSettingUtil";

/**
 * @description スクリーンで選択中のElementをmatrixに合わせて変形させる
 *              Transform the selected Element on the screen according to the matrix
 *
 * @param  {number} scale_x
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (scale_x: number): Promise<void> =>
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
    const concatenatedMatrix = $getConcatenatedMatrix();
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

            const localX = referenceSetting.x * matrix.a + referenceSetting.y * matrix.c + matrix.tx;
            const localY = referenceSetting.x * matrix.b + referenceSetting.y * matrix.d + matrix.ty;

            // 幅は親空間でのAABBの幅なので、親空間のX軸方向に伸縮させる。
            // characterのmatrixで挟み込むことで、回転やシアーがあっても
            // 全ての点のx座標がscale_x倍になり、AABBの幅もscale_x倍になる。
            const linearMatrix = new Float32Array([
                character.matrix[0], character.matrix[1],
                character.matrix[2], character.matrix[3],
                0, 0
            ]);

            const invertMatrix = new Matrix(...linearMatrix);
            invertMatrix.invert();

            const parentMatrix = Matrix.multiply(
                new Float32Array([1, 0, 0, 1, localX, localY]),
                Matrix.multiply(
                    Matrix.multiply(
                        new Float32Array([
                            invertMatrix.a, invertMatrix.b,
                            invertMatrix.c, invertMatrix.d,
                            0, 0
                        ]),
                        Matrix.multiply(
                            new Float32Array([scale_x, 0, 0, 1, 0, 0]),
                            linearMatrix
                        )
                    ),
                    new Float32Array([1, 0, 0, 1, -localX, -localY])
                )
            );

            // matrix情報を更新
            character.matrix.set(
                Matrix.multiply(character.matrix, parentMatrix)
            );

            const nodeStyle = node.style;
            nodeStyle.setProperty("--transform", $createTransformElementStyle(character));

            const bounds = character.getBounds(frame, true);
            if (bounds) {
                nodeStyle.width  = `${Math.ceil(Math.abs(bounds.xMax - bounds.xMin))}px`;
                nodeStyle.height = `${Math.ceil(Math.abs(bounds.yMax - bounds.yMin))}px`;
                nodeStyle.left   = `${$getScreenOffsetLeft() + bounds.xMin}px`;
                nodeStyle.top    = `${$getScreenOffsetTop()  + bounds.yMin}px`;
            }

            // 変形後のmatrixに合わせて表示サイズを更新
            transformSettingUpdateElementSizeService(node, character, frame);

            await screenDisplayObjectUpdateMaskInCanvasStyleService(node, layer, character);

            if (movieClip.isSingleSelectedOfDisplayObject()) {
                transformSettingUpdateXElementService(character.x);
                transformSettingUpdateYElementService(character.y);
                transformSetting.w = character.width;
                transformSettingUpdateWidthElementService(character.width);
                transformSettingUpdateRotationElementService(character.rotation);

                // 親空間のX軸方向の伸縮なので、回転している場合はscaleYも変化する
                transformSetting.scaleX = character.scaleX;
                transformSetting.scaleY = character.scaleY;
                transformSettingUpdateScaleXElementService(
                    Math.round(character.scaleX * 10000) / 100
                );
                transformSettingUpdateScaleYElementService(
                    Math.round(character.scaleY * 10000) / 100
                );

                // MovieClipの基準点を再配置
                screenStandardPointDeployElementUseCase();
            }
        }
    }

    // 変形エリアのy座標を更新
    if (!movieClip.isSingleSelectedOfDisplayObject()) {
        const bounds = screenAreaCalcSelectedBoundsService(movieClip);
        if (bounds) {
            transformSettingUpdateXElementService(bounds.xMin);
            transformSettingUpdateYElementService(bounds.yMin);
            transformSetting.w = Math.round(Math.abs(bounds.xMax - bounds.xMin) * 100) / 100;
            transformSettingUpdateWidthElementService(transformSetting.w);
        }

        // 複数選択時は個々のscaleXを表示できないので、累積値を表示する
        transformSetting.scaleX *= scale_x;
        transformSettingUpdateScaleXElementService(
            Math.round(transformSetting.scaleX * 10000) / 100
        );
    }
};