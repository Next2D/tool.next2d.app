import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { LayerModeImpl } from "@/interface/LayerModeImpl";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerControllerUpdateIconElementService } from "@/timeline/application/TimelineLayerController/service/TimelineLayerControllerUpdateIconElementService";
import {
    $GUIDE_IN_MODE,
    $GUIDE_MODE,
    $MASK_IN_MODE,
    $MASK_MODE
} from "@/config/LayerModeConfig";

/**
 * @description レイヤーモードを変更前に戻す
 *              Revert the layer mode to the previous state
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} index
 * @param  {number} before_mode
 * @param  {number} before_parent_id
 * @param  {array} indexes
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    library_id: number,
    index: number,
    before_mode: LayerModeImpl,
    before_parent_id: number,
    indexes: number[]
): void => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const movieClip: InstanceImpl<MovieClip> | null = workSpace.getLibrary(library_id);
    if (!movieClip) {
        return ;
    }

    const layer = movieClip.layers[index];
    if (!layer) {
        return ;
    }

    // 元の色に戻す
    layer.mode = before_mode;
    layer.parentId = before_parent_id;

    for (let idx = 0; idx < indexes.length; ++idx) {

        const childLayer = movieClip.layers[indexes[idx]];
        childLayer.parentId = layer.id;

        switch (before_mode) {

            case $MASK_MODE:
                childLayer.mode = $MASK_IN_MODE;
                break;

            case $GUIDE_MODE:
                childLayer.mode = $GUIDE_IN_MODE;
                break;

            default:
                break;

        }

        if (workSpace.active && movieClip.active) {
            timelineLayerControllerUpdateIconElementService(childLayer);
        }
    }

    // 起動中ならライブラリエリアの表示を更新
    // アクティブな場合のみ処理を行う
    if (workSpace.active && movieClip.active) {
        timelineLayerControllerUpdateIconElementService(layer);
    }
};