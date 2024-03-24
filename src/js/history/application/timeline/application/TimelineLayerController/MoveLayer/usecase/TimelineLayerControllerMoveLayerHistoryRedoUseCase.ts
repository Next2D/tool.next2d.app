import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { LayerModeImpl } from "@/interface/LayerModeImpl";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerBuildElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase";
import { execute as externalTimelineLayerControllerCorrectionRelationshipService } from "@/external/timeline/application/ExternalTimelineLayerController/service/ExternalTimelineLayerControllerCorrectionRelationshipService";
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
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    library_id: number,
    before_index: number,
    after_index: number,
    after_mode: LayerModeImpl,
    after_parent_id: number
): void => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const movieClip: InstanceImpl<MovieClip> | null = workSpace.getLibrary(library_id);
    if (!movieClip) {
        return ;
    }

    const layers = movieClip.layers.splice(before_index, 1);
    if (!layers.length) {
        return ;
    }

    const layer = layers[0];
    layer.mode     = after_mode;
    layer.parentId = after_parent_id;

    switch (layer.mode) {

        case $MASK_MODE: // マスクレイヤー
        case $GUIDE_MODE: // ガイドレイヤー
            if (after_index > before_index) {

                let childCount = 0;
                for (let idx = before_index; idx < movieClip.layers.length; ++idx) {
                    const childLayer = movieClip.layers[idx];
                    if (childLayer.parentId !== layer.id) {
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
        timelineLayerBuildElementUseCase();
    }
};