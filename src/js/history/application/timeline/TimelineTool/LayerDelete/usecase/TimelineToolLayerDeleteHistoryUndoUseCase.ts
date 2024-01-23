import type { LayerSaveObjectImpl } from "@/interface/LayerSaveObjectImpl";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as timelineScrollUpdateHeightService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateHeightService";
import { execute as timelineLayerBuildElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase";
import { execute as timelineLayerControllerNormalSelectUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerNormalSelectUseCase";
import { Layer } from "@/core/domain/model/Layer";
import { $getWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description 削除したレイヤーを元の配置に元に戻す
 *              Restore deleted layers to their original placement
 *
 * @param  {number} work_space_id
 * @param  {number} library_id
 * @param  {object} layer_object
 * @param  {number} index
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    library_id: number,
    layer_object: LayerSaveObjectImpl,
    index: number
): void => {

    const workSpace = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const movieClip: InstanceImpl<MovieClip> | null = workSpace.getLibrary(library_id);
    if (!movieClip) {
        return ;
    }

    // Layerオブジェクトの内部情報に再登録
    const layer = new Layer(layer_object);
    movieClip.setLayer(layer, index);

    // 復元したレイヤーを選択状に更新
    timelineLayerControllerNormalSelectUseCase(layer);

    // タイムラインのyスクロールの高さを更新
    timelineScrollUpdateHeightService();

    // タイムラインを再描画
    timelineLayerBuildElementUseCase();
};