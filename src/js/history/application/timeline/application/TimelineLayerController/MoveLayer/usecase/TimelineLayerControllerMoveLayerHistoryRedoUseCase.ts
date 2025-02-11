import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { ILayerMode } from "@/interface/ILayerMode";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerBuildElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase";
import { execute as externalTimelineLayerControllerCorrectionRelationshipService } from "@/external/timeline/application/ExternalTimelineLayerController/service/ExternalTimelineLayerControllerCorrectionRelationshipService";
import { execute as screenAreaUpdateMovedLayerService } from "@/screen/application/ScreenArea/service/ScreenAreaUpdateMovedLayerService";
import { execute as screenDisplayObjectUpdateLayerMaskInElementUseCase } from "@/screen/application/DisplayObject/usecase/ScreenDisplayObjectUpdateLayerMaskInElementUseCase";
import {
    $GUIDE_MODE,
    $MASK_MODE
} from "@/config/LayerModeConfig";

/**
 * @description レイヤーの移動を変更後に戻す
 *              Undo Layer Movement
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} before_index
 * @param  {number} after_index
 * @param  {number} after_mode
 * @param  {number} after_parent_id
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    work_space_id: number,
    library_id: number,
    before_index: number,
    after_index: number,
    after_mode: ILayerMode,
    after_parent_id: number
): Promise<void> => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const movieClip = workSpace.getLibrary(library_id) as MovieClip;
    if (!movieClip) {
        return ;
    }

    const layers = movieClip.layers.splice(before_index, 1);
    if (!layers.length) {
        return ;
    }

    const layer = layers[0];
    const parentId = layer.parentId;
    layer.mode     = after_mode;
    layer.parentId = after_parent_id;

    switch (layer.mode) {

        case $MASK_MODE: // マスクレイヤー
        case $GUIDE_MODE: // ガイドレイヤー
            if (after_index > before_index) {

                let childCount = 0;
                for (let idx = before_index; idx < movieClip.layers.length; ++idx) {
                    const childLayer = movieClip.getLayer(idx);
                    if (!childLayer || childLayer.parentId !== layer.id) {
                        if (before_index + 1 > idx) {
                            break;
                        }
                        continue;
                    }

                    childCount++;
                }

                movieClip.layers.splice(after_index + childCount, 0, layer);
            } else {
                movieClip.layers.splice(after_index, 0, layer);
            }

            externalTimelineLayerControllerCorrectionRelationshipService(
                movieClip,
                layer,
                before_index
            );
            break;

        default:
            movieClip.layers.splice(after_index, 0, layer);
            break;

    }

    // アクティブならタイムラインを再描画
    if (workSpace.active && movieClip.active) {
        // タイムラインのelementを再構築
        timelineLayerBuildElementUseCase();

        // スクリーンの表示を更新
        screenAreaUpdateMovedLayerService(layer);

        if (parentId > -1 || after_parent_id > -1) {
            await screenDisplayObjectUpdateLayerMaskInElementUseCase(movieClip, layer);
        }
    }
};