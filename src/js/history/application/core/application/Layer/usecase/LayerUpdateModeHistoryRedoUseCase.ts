import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { LayerModeImpl } from "@/interface/LayerModeImpl";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerControllerUpdateIconElementService } from "@/timeline/application/TimelineLayerController/service/TimelineLayerControllerUpdateIconElementService";

/**
 * @description レイヤーモードを変更後に戻す
 *              Revert the layer mode to the previous state
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {number} index
 * @param  {number} after_mode
 * @param  {number} after_parent_id
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    library_id: number,
    index: number,
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

    const layer = movieClip.layers[index];
    if (!layer) {
        return ;
    }

    // 元の色に戻す
    layer.mode = after_mode;
    layer.parentId = after_parent_id;

    let idx = movieClip.layers.indexOf(layer) + 1;
    for (; idx < movieClip.layers.length; ++idx) {

        const childLayer = movieClip.layers[idx];
        if (childLayer.parentId !== layer.id) {
            break;
        }

        childLayer.clearRelation();
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