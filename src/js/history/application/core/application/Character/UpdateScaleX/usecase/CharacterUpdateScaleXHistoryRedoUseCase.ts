import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as targetRectUpdateElementUseCase } from "@/screen/application/TargetRect/usecase/TargetRectUpdateElementUseCase";
import { execute as transformSettingUpdateScaleXElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateScaleXElementService";
import { execute as screenAreaGetElementFromLayerIdAndDepthService } from "@/screen/application/ScreenArea/service/ScreenAreaGetElementFromLayerIdAndDepthService";
import { execute as screenAreaReplaceCanvasUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaReplaceCanvasUseCase";
import { execute as transformSettingUpdateWidthElementService } from "@/controller/application/TransformSetting/service/TransformSettingUpdateWidthElementService";
import { execute as screenAreaCalcSelectedBoundsService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService";

/**
 * @description DisplayObjectのx座標を変更後に戻す
 *              Reset the x coordinate of the DisplayObject
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} index
 * @param  {number} keyframe
 * @param  {number} depth
 * @param  {number} after_x
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    work_space_id: number,
    library_id: number,
    index: number,
    keyframe: number,
    depth: number,
    after_scale_x: number
): Promise<void> => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const movieClip = workSpace.getLibrary(library_id) as MovieClip;
    if (!movieClip) {
        return ;
    }

    const layer = movieClip.getLayer(index);
    if (!layer) {
        return ;
    }

    const character = layer.getCharacter(keyframe, depth);
    if (!character) {
        return ;
    }

    // データを更新
    character.scaleX = after_scale_x / 100;

    // 変形の基準点を移動
    character.referencePosition.x *= after_scale_x / 100;

    // アクティブなら表示を更新
    if (workSpace.active && movieClip.active) {
        if (movieClip.selectedDepths.size > 0) {
            // 選択範囲のElementを移動
            targetRectUpdateElementUseCase();

            // 選択範囲のバウンディングボックスを取得
            const bounds = screenAreaCalcSelectedBoundsService(movieClip);
            if (bounds) {
                transformSettingUpdateWidthElementService(Math.abs(bounds.xMax - bounds.xMin));
            }

            // TransformSettingのxスケールを更新
            if (movieClip.selectedDepths.size === 1) {
                for (const [layerIndex, depths] of movieClip.selectedDepths) {
                    const selectedLayer = movieClip.getLayer(layerIndex);
                    if (!selectedLayer) {
                        break;
                    }

                    if (selectedLayer.id === layer.id
                        && depths[0] === character.depth
                    ) {
                        transformSettingUpdateScaleXElementService(character.scaleX * 100);
                    }
                }
            }
        }

        // canvasを再描画
        const element = screenAreaGetElementFromLayerIdAndDepthService(layer.id, character.depth);
        if (element) {
            await screenAreaReplaceCanvasUseCase(character, element, layer);
        }
    }
};